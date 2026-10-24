'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Settings, User, Key, ShieldCheck, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    college: 'Stanford University',
    degree: 'B.S. Computer Science',
    skills: 'Python, React, SQL, Data Structures, System Design',
    targetRole: 'Software Developer',
    experienceLevel: 'Fresher',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setProfile({
            name: data.user.name || '',
            college: data.user.college || '',
            degree: data.user.degree || '',
            skills: data.user.skills || '',
            targetRole: data.user.targetRole || 'Software Developer',
            experienceLevel: data.user.experienceLevel || 'Fresher',
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Account & AI Config</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17201B]">Candidate Settings</h1>
          <p className="text-xs text-[#66736B]">Manage your profile preferences, target roles, and AI provider environment keys.</p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold border border-[#087F5B]/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-xs">
          <h3 className="text-base font-bold text-[#17201B] mb-6 flex items-center">
            <User className="w-4 h-4 mr-2 text-[#087F5B]" /> Candidate Profile Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">Target Job Role</label>
                <select
                  value={profile.targetRole}
                  onChange={e => setProfile({ ...profile, targetRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">College / University</label>
                <input
                  type="text"
                  value={profile.college}
                  onChange={e => setProfile({ ...profile, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17201B] mb-1">Degree</label>
                <input
                  type="text"
                  value={profile.degree}
                  onChange={e => setProfile({ ...profile, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17201B] mb-1">Technical Skills</label>
              <input
                type="text"
                placeholder="Python, React, SQL, Algorithms"
                value={profile.skills}
                onChange={e => setProfile({ ...profile, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            <div className="pt-4 border-t border-[#E2E5E1] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Security & Provider Settings */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#17201B] flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#087F5B]" /> Security & AI API Key Management
          </h3>

          <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] text-xs text-[#17201B] space-y-2 leading-relaxed">
            <p className="font-bold text-[#087F5B] flex items-center">
              🔒 Server-Side Secret Protection Enforced
            </p>
            <p className="text-[#66736B]">
              In accordance with security requirements, AI provider keys are NEVER exposed in browser bundles or client-side JavaScript.
            </p>
            <p className="text-[#66736B]">
              To use live Gemini/OpenAI API providers instead of Demo AI Mode, set <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E5E1] font-mono text-[#087F5B]">AI_API_KEY</code> in your server-side environment variables (`.env`).
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
