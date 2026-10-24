import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AIService } from '@/services/ai/aiService';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const interview = await db.interview.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: 'asc' } } },
  });

  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  // Check if report already exists in metadata
  let parsedMeta: any = {};
  try {
    if (interview.metadata) parsedMeta = JSON.parse(interview.metadata);
  } catch {}

  if (parsedMeta.report) {
    return NextResponse.json({
      success: true,
      interview,
      report: parsedMeta.report,
    });
  }

  // Otherwise generate
  return handleComplete(user.id, interview);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const interview = await db.interview.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: 'asc' } } },
  });

  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  // Check if report already exists
  let parsedMeta: any = {};
  try {
    if (interview.metadata) parsedMeta = JSON.parse(interview.metadata);
  } catch {}

  if (interview.status === 'completed' && parsedMeta.report) {
    return NextResponse.json({
      success: true,
      interview,
      report: parsedMeta.report,
    });
  }

  return handleComplete(user.id, interview);
}

async function handleComplete(userId: string, interview: any) {
  const questionsPayload = interview.questions.map((q: any) => {
    let parsedFeedback = { whatDidWell: [], whatToImprove: [] };
    try {
      if (q.feedback) parsedFeedback = JSON.parse(q.feedback);
    } catch (e) {}

    return {
      question: q.question,
      category: q.category || 'General CS',
      subtopic: q.subtopic,
      userAnswer: q.answer || '(Skipped)',
      score: q.score || 0,
      evaluation: {
        overallScore: q.score || 0,
        dimensions: {
          technicalAccuracy: q.technicalAccuracy || 0,
          relevance: q.relevance || 0,
          completeness: q.completeness || 0,
          clarity: q.clarity || 0,
          problemSolving: q.problemSolving || 0,
          communication: q.communication || 0,
        },
        whatDidWell: parsedFeedback.whatDidWell || [],
        whatToImprove: parsedFeedback.whatToImprove || [],
        idealAnswer: q.idealAnswer || '',
        nextDifficultySuggestion: (q.difficulty as any) || 'Medium',
        topicTag: q.category || 'General CS',
      },
    };
  });

  const finalReport = await AIService.generateFinalReport({
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel || undefined,
    interviewType: interview.interviewType,
    questions: questionsPayload,
  });

  // Parse existing metadata
  let meta: any = {};
  try {
    if (interview.metadata) meta = JSON.parse(interview.metadata);
  } catch {}
  meta.report = finalReport;
  meta.weakTopics = finalReport.weakTopics;

  // Update interview record
  const completedInterview = await db.interview.update({
    where: { id: interview.id },
    data: {
      status: 'completed',
      score: finalReport.overallPercentage,
      completedAt: new Date(),
      metadata: JSON.stringify(meta),
    },
  });

  // Persist updated skills to DB for analytics tracking
  const skillEntries = [
    { skill: 'Technical Knowledge', score: finalReport.skillScores.technicalKnowledge },
    { skill: 'Communication', score: finalReport.skillScores.communication },
    { skill: 'Problem Solving', score: finalReport.skillScores.problemSolving },
    { skill: 'Answer Relevance', score: finalReport.skillScores.answerRelevance },
    { skill: 'Confidence', score: finalReport.skillScores.confidence },
  ];

  for (const s of skillEntries) {
    await db.skill.upsert({
      where: {
        id: `${userId}-${s.skill}`,
      },
      update: { score: s.score },
      create: {
        id: `${userId}-${s.skill}`,
        userId: userId,
        skill: s.skill,
        score: s.score,
      },
    });
  }

  return NextResponse.json({
    success: true,
    interview: completedInterview,
    report: finalReport,
  });
}
