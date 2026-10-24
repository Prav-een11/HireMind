import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AIService } from '@/services/ai/aiService';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { questionId, userAnswer, totalQuestions = 5, resumeText } = body;

  if (!questionId || userAnswer === undefined) {
    return NextResponse.json({ error: 'questionId and userAnswer are required' }, { status: 400 });
  }

  const interview = await db.interview.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: 'asc' } } },
  });

  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  const question = await db.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  let rubricObj: any = null;
  try {
    if (question.rubric) rubricObj = JSON.parse(question.rubric);
  } catch {}

  let competenciesArr: string[] = [];
  try {
    if (question.expectedCompetencies) competenciesArr = JSON.parse(question.expectedCompetencies);
  } catch {}

  // 1. Evaluate answer using AI Service across 6 dimensions
  const evalResult = await AIService.evaluateAnswer({
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel || undefined,
    interviewType: interview.interviewType,
    difficulty: question.difficulty,
    question: question.question,
    userAnswer,
    category: question.category || undefined,
    subtopic: question.subtopic || undefined,
    expectedCompetencies: competenciesArr,
    rubric: rubricObj,
    expectedDepth: question.expectedDepth || undefined,
    isFollowUp: question.isFollowUp,
  });

  // 2. Update current question in DB with detailed scores and feedback
  const updatedQuestion = await db.question.update({
    where: { id: questionId },
    data: {
      answer: userAnswer,
      score: evalResult.overallScore,
      technicalAccuracy: evalResult.dimensions.technicalAccuracy,
      relevance: evalResult.dimensions.relevance,
      completeness: evalResult.dimensions.completeness,
      clarity: evalResult.dimensions.clarity,
      problemSolving: evalResult.dimensions.problemSolving,
      communication: evalResult.dimensions.communication,
      feedback: JSON.stringify({
        whatDidWell: evalResult.whatDidWell,
        whatToImprove: evalResult.whatToImprove,
        missingConcepts: evalResult.missingConcepts || [],
        specificCorrections: evalResult.specificCorrections || [],
        topicTag: evalResult.topicTag,
        nextDifficultySuggestion: evalResult.nextDifficultySuggestion,
      }),
      idealAnswer: evalResult.idealAnswer || question.idealAnswer,
    },
  });

  // 3. Track session state in metadata
  let sessionMeta: { askedQuestionIds: string[]; askedTopics: string[]; weakTopics: string[] } = {
    askedQuestionIds: [],
    askedTopics: [],
    weakTopics: [],
  };
  try {
    if (interview.metadata) sessionMeta = JSON.parse(interview.metadata);
  } catch {}

  if (question.questionId && !sessionMeta.askedQuestionIds.includes(question.questionId)) {
    sessionMeta.askedQuestionIds.push(question.questionId);
  }
  if (question.category && !sessionMeta.askedTopics.includes(question.category)) {
    sessionMeta.askedTopics.push(question.category);
  }

  // Record weak topic if score was low (< 6.0)
  if (evalResult.overallScore < 6.0 && question.category) {
    if (!sessionMeta.weakTopics.includes(question.category)) {
      sessionMeta.weakTopics.push(question.category);
    }
  }

  const currentCount = interview.questions.length;
  const targetTotal = interview.totalQuestions || totalQuestions || 5;
  const isLastQuestion = currentCount >= targetTotal;

  let nextQuestion = null;

  if (!isLastQuestion) {
    // Determine whether to ask an adaptive follow-up or a new question
    const shouldAskFollowUp = !question.isFollowUp && evalResult.shouldAskFollowUp && currentCount < targetTotal;

    if (shouldAskFollowUp) {
      // Generate adaptive follow-up
      const generatedFollowUp = await AIService.generateInterviewQuestion({
        jobRole: interview.jobRole,
        experienceLevel: interview.experienceLevel || undefined,
        interviewType: interview.interviewType as any,
        difficulty: evalResult.nextDifficultySuggestion,
        questionIndex: currentCount + 1,
        totalQuestions: targetTotal,
        isFollowUp: true,
        parentQuestion: question,
        candidatePreviousAnswer: userAnswer,
        candidatePreviousScore: evalResult.overallScore,
      });

      nextQuestion = await db.question.create({
        data: {
          interviewId: interview.id,
          questionId: generatedFollowUp.questionId,
          question: generatedFollowUp.question,
          category: generatedFollowUp.category || 'Follow-Up Probing',
          subtopic: generatedFollowUp.subtopic || question.subtopic,
          difficulty: generatedFollowUp.difficulty,
          isFollowUp: true,
          parentQuestionId: question.id,
          followUpObjectives: generatedFollowUp.followUpObjectives,
          expectedDepth: generatedFollowUp.expectedDepth || '45-90 seconds focused response',
          idealAnswer: generatedFollowUp.idealAnswer,
        },
      });
    } else {
      // Select a new question with calibrated difficulty
      let nextDifficulty = evalResult.nextDifficultySuggestion;

      // Ensure fresh question not previously asked
      const generated = await AIService.generateInterviewQuestion({
        jobRole: interview.jobRole,
        experienceLevel: interview.experienceLevel || undefined,
        interviewType: interview.interviewType as any,
        difficulty: nextDifficulty,
        questionIndex: currentCount + 1,
        totalQuestions: targetTotal,
        weakTopics: sessionMeta.weakTopics,
        previousQuestionIds: sessionMeta.askedQuestionIds,
        previousQuestionTopics: sessionMeta.askedTopics,
        resumeContext: resumeText,
      });

      nextQuestion = await db.question.create({
        data: {
          interviewId: interview.id,
          questionId: generated.questionId,
          question: generated.question,
          category: generated.category,
          subtopic: generated.subtopic,
          difficulty: generated.difficulty,
          expectedCompetencies: generated.expectedCompetencies ? JSON.stringify(generated.expectedCompetencies) : null,
          rubric: generated.evaluationRubric ? JSON.stringify(generated.evaluationRubric) : null,
          expectedDepth: generated.expectedDepth,
          constraints: generated.constraints ? JSON.stringify(generated.constraints) : null,
          testCases: generated.testCases ? JSON.stringify(generated.testCases) : null,
          followUpObjectives: generated.followUpObjectives,
          idealAnswer: generated.idealAnswer || generated.suggestedPoints?.join('; '),
        },
      });

      if (generated.questionId) sessionMeta.askedQuestionIds.push(generated.questionId);
      if (generated.category) sessionMeta.askedTopics.push(generated.category);
    }

    // Persist updated session metadata
    await db.interview.update({
      where: { id: interview.id },
      data: { metadata: JSON.stringify(sessionMeta) },
    });
  }

  return NextResponse.json({
    success: true,
    evaluation: evalResult,
    evaluatedQuestion: updatedQuestion,
    nextQuestion,
    isCompleted: isLastQuestion,
  });
}
