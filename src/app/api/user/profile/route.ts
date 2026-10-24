import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: body.name ?? user.name,
        college: body.college ?? user.college,
        degree: body.degree ?? user.degree,
        skills: body.skills ?? user.skills,
        experienceLevel: body.experienceLevel ?? user.experienceLevel,
        targetRole: body.targetRole ?? user.targetRole,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
