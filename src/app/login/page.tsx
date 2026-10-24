'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Brain, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('candidate@hiremind.ai');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-between text-[#17201B]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#087F5B] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
              H
            </div>
            <h1 className="text-2xl font-bold text-[#17201B]">Welcome Back</h1>
            <p className="text-xs text-[#66736B] mt-1">
              Log in to your HireMind candidate dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#D64545]/10 text-[#D64545] text-xs font-medium border border-[#D64545]/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#17201B] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#17201B] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#66736B]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#087F5B] font-semibold hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
