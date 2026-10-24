import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CodeExecutionService } from '@/services/codeExecution/codeExecutionService';
import { CODING_PROBLEMS, CodingProblemEngine } from '@/services/coding/problemBank';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const problemId = searchParams.get('id');
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  if (problemId) {
    const problem = CodingProblemEngine.getProblemById(problemId);
    if (!problem) return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    return NextResponse.json({ success: true, problem });
  }

  let list = CodingProblemEngine.getAllProblems();
  if (category) {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (difficulty) {
    list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  // Return problem list summaries
  const summaries = list.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    tags: p.tags,
    statement: p.statement.slice(0, 150) + '...',
    timeComplexityExpected: p.timeComplexityExpected,
    spaceComplexityExpected: p.spaceComplexityExpected,
    totalTests: p.testCases.length,
    sampleTests: p.testCases.filter(t => !t.isHidden).length,
  }));

  return NextResponse.json({ success: true, problems: summaries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { language, code, problemId, isSubmission } = body;

    const result = await CodeExecutionService.executeCode({
      language: language || 'python',
      code: code || '',
      problemId: problemId || 'two-sum',
      isSubmission: Boolean(isSubmission),
    });

    // If submission and user is logged in, persist to database
    try {
      const user = await getCurrentUser();
      if (user && isSubmission) {
        const problem = CodingProblemEngine.getProblemById(problemId || 'two-sum') || CODING_PROBLEMS[0];
        await db.codingSubmission.create({
          data: {
            userId: user.id,
            problemId: problem.id,
            problemTitle: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            language: language || 'python',
            code: code || '',
            status: result.status,
            executionMode: result.executionEngine,
            passedTests: result.passedTests,
            totalTests: result.totalTests,
            runtimeMs: result.executionTimeMs,
            memoryMb: result.memoryMb,
          },
        });
      }
    } catch (dbErr) {
      console.error('Failed to log coding submission:', dbErr);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Execution error' }, { status: 500 });
  }
}
