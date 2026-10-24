import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AIService } from '@/services/ai/aiService';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const analysis = await AIService.analyzeResume({
      resumeText,
      jobDescription,
    });

    // Save resume record in DB
    const savedResume = await db.resume.create({
      data: {
        userId: user.id,
        extractedText: resumeText.slice(0, 3000),
        resumeScore: analysis.resumeScore,
      },
    });

    return NextResponse.json({
      success: true,
      resumeId: savedResume.id,
      analysis,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Resume analysis failed' }, { status: 500 });
  }
}
