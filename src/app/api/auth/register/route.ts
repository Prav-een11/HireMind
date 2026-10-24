import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, college, degree, targetRole, experienceLevel } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: `hashed-${password}`, // demo hashing
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        college: college || 'University Graduate',
        degree: degree || 'Bachelor of Science',
        targetRole: targetRole || 'Software Developer',
        experienceLevel: experienceLevel || 'Fresher',
        skills: 'Data Structures, React, SQL',
      },
    });

    const cookieStore = await cookies();
    cookieStore.set('hiremind_user_id', newUser.id, { httpOnly: true, path: '/' });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        experienceLevel: newUser.experienceLevel,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
