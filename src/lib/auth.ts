import { db } from './db';
import { cookies } from 'next/headers';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  college?: string | null;
  degree?: string | null;
  skills?: string | null;
  experienceLevel?: string | null;
  targetRole?: string | null;
}

export const DEV_USER_EMAIL = 'candidate@hiremind.ai';

export async function getOrCreateDefaultUser(): Promise<AuthUser> {
  let user = await db.user.findUnique({
    where: { email: DEV_USER_EMAIL },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        name: 'Alex Morgan',
        email: DEV_USER_EMAIL,
        password: 'hashed-password-demo',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        college: 'Stanford University',
        degree: 'B.S. Computer Science',
        skills: 'Python, React, SQL, Data Structures, System Design',
        experienceLevel: 'Fresher',
        targetRole: 'Software Developer',
      },
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    college: user.college,
    degree: user.degree,
    skills: user.skills,
    experienceLevel: user.experienceLevel,
    targetRole: user.targetRole,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('hiremind_user_id')?.value;

    if (userIdCookie) {
      const user = await db.user.findUnique({ where: { id: userIdCookie } });
      if (user) return user;
    }

    // Default to the main demo user if no cookie set yet
    return await getOrCreateDefaultUser();
  } catch (err) {
    console.error('Error fetching current user:', err);
    return getOrCreateDefaultUser();
  }
}
