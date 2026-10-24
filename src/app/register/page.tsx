'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowRight, User, Mail, Lock, GraduationCap, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    degree: '',
    targetRole: 'Software Developer',
    experienceLevel: 'Fresher',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

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

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#087F5B] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">
              H
            </div>
            <h1 className="text-2xl font-bold text-[#17201B]">Create HireMind Profile</h1>
            <p className="text-xs text-[#66736B] mt-1">
              Start practicing AI interviews tailored to your exact career goals
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#D64545]/10 text-[#D64545] text-xs font-medium border border-[#D64545]/20">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#17201B] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17201B] mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#17201B] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#17201B] mb-1">College / University</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                  <input
                    type="text"
                    placeholder="Stanford University"
                    value={formData.college}
                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17201B] mb-1">Target Job Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
                  <select
                    value={formData.targetRole}
                    onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-sm focus:outline-none focus:border-[#087F5B]"
                  >
                    <option value="Software Developer">Software Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Profile & Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#66736B]">
            Already registered?{' '}
            <Link href="/login" className="text-[#087F5B] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
