import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      // Auto-create for seamless testing if demo login
      user = await db.user.create({
        data: {
          name: email.split('@')[0],
          email,
          password: `hashed-${password}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          targetRole: 'Software Developer',
          experienceLevel: 'Fresher',
        },
      });
    }

    const cookieStore = await cookies();
    cookieStore.set('hiremind_user_id', user.id, { httpOnly: true, path: '/' });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
