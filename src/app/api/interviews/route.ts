import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AIService } from '@/services/ai/aiService';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const interviews = await db.interview.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      questions: true,
    },
  });

  return NextResponse.json({ interviews, isDemoMode: AIService.isDemoMode() });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      totalQuestions = 5,
      resumeText,
    } = body;

    const chosenRole = jobRole || user.targetRole || 'Software Developer';
    const chosenExp = experienceLevel || user.experienceLevel || 'Fresher';
    const chosenType = interviewType || 'Technical';
    const chosenDiff = difficulty || 'Adaptive';

    // 1. Generate Question 1 with full context
    const initialDifficulty = chosenDiff === 'Adaptive' ? (chosenExp === 'Fresher' ? 'Easy' : 'Medium') : chosenDiff;

    const generated = await AIService.generateInterviewQuestion({
      jobRole: chosenRole,
      experienceLevel: chosenExp,
      interviewType: chosenType as any,
      difficulty: initialDifficulty,
      questionIndex: 1,
      totalQuestions: Number(totalQuestions) || 5,
      resumeContext: resumeText,
    });

    // 2. Create Interview in DB
    const interview = await db.interview.create({
      data: {
        userId: user.id,
        jobRole: chosenRole,
        experienceLevel: chosenExp,
        interviewType: chosenType,
        difficulty: chosenDiff,
        totalQuestions: Number(totalQuestions) || 5,
        status: 'in-progress',
        metadata: JSON.stringify({
          askedQuestionIds: generated.questionId ? [generated.questionId] : [],
          askedTopics: [generated.category || 'Core CS'],
          weakTopics: [],
        }),
      },
    });

    // 3. Persist Question 1 with complete structured metadata
    const firstQuestion = await db.question.create({
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

    return NextResponse.json({
      success: true,
      interview,
      firstQuestion,
      isDemoMode: AIService.isDemoMode(),
    });
  } catch (err: any) {
    console.error('Error starting interview:', err);
    return NextResponse.json({ error: err.message || 'Failed to start interview' }, { status: 500 });
  }
}
