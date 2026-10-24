import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const interview = await db.interview.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!interview || interview.userId !== user.id) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  return NextResponse.json({ interview });
}
