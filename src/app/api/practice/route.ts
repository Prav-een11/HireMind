import { NextResponse } from 'next/server';
import { AIService } from '@/services/ai/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, difficulty, count } = body;

    const questions = await AIService.generatePracticeQuestions({
      topic: topic || 'Data Structures',
      difficulty: difficulty || 'Medium',
      count: count || 5,
    });

    return NextResponse.json({ success: true, questions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Practice generation failed' }, { status: 500 });
  }
}
