'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  Briefcase,
  Layers,
  BarChart2,
  FileText,
  Upload,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function InterviewConfigPage() {
  const router = useRouter();

  const [jobRole, setJobRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [resumeText, setResumeText] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeUploaded(true);
      // Extract dummy or plain text representation
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText((event.target?.result as string) || `Extracted text from ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const finalRole = jobRole === 'Custom' ? customRole || 'Software Engineer' : jobRole;

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole: finalRole,
          experienceLevel,
          interviewType,
          difficulty,
          totalQuestions,
          resumeText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start interview');

      // Navigate directly to active interview room with interview ID
      router.push(`/interview/${data.interview.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-sm">
          <div className="mb-8 border-b border-[#E2E5E1] pb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Setup</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17201B]">Configure Your AI Mock Interview</h1>
            <p className="text-xs text-[#66736B] mt-1">
              Customize the role, difficulty, and questions to match your target job interview.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#D64545]/10 text-[#D64545] text-xs font-medium border border-[#D64545]/20">
              {error}
            </div>
          )}

          <form onSubmit={handleStartInterview} className="space-y-6">
            {/* 1. Job Role */}
            <div>
              <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                1. Target Job Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Software Developer',
                  'Frontend Developer',
                  'Backend Developer',
                  'Full Stack Developer',
                  'Data Analyst',
                  'Data Scientist',
                  'Machine Learning Engineer',
                  'DevOps Engineer',
                  'Cybersecurity Analyst',
                  'UI/UX Designer',
                  'Product Manager',
                  'Custom',
                ].map(role => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setJobRole(role)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      jobRole === role
                        ? 'border-[#087F5B] bg-[#DDF3EA]/40 text-[#087F5B] shadow-xs'
                        : 'border-[#E2E5E1] bg-white text-[#17201B] hover:bg-[#F1F3EF]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {jobRole === 'Custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter custom job title (e.g. Embedded Systems Engineer)"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-sm focus:outline-none focus:border-[#087F5B]"
                  />
                </div>
              )}
            </div>

            {/* 2. Experience & Interview Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                  2. Experience Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Fresher', '1–2 Years', '3–5 Years', '5+ Years'].map(exp => (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => setExperienceLevel(exp)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        experienceLevel === exp
                          ? 'border-[#087F5B] bg-[#DDF3EA] text-[#087F5B]'
                          : 'border-[#E2E5E1] bg-white text-[#66736B] hover:bg-[#F1F3EF]'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                  3. Interview Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Technical', 'HR', 'Behavioral', 'Coding', 'Mixed'].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setInterviewType(type)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        interviewType === type
                          ? 'border-[#087F5B] bg-[#DDF3EA] text-[#087F5B]'
                          : 'border-[#E2E5E1] bg-white text-[#66736B] hover:bg-[#F1F3EF]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Difficulty & Number of Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                  4. Difficulty Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Easy', 'Medium', 'Hard', 'Adaptive'].map(diff => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        difficulty === diff
                          ? 'border-[#087F5B] bg-[#DDF3EA] text-[#087F5B]'
                          : 'border-[#E2E5E1] bg-white text-[#66736B] hover:bg-[#F1F3EF]'
                      }`}
                    >
                      {diff === 'Adaptive' ? 'Adaptive⚡' : diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                  5. Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map(count => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setTotalQuestions(count)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        totalQuestions === count
                          ? 'border-[#087F5B] bg-[#DDF3EA] text-[#087F5B]'
                          : 'border-[#E2E5E1] bg-white text-[#66736B] hover:bg-[#F1F3EF]'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Resume Context (Optional PDF Upload) */}
            <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#17201B] uppercase tracking-wider flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-[#087F5B]" />
                  Resume Context (Optional)
                </span>
                {resumeUploaded && (
                  <span className="text-xs font-semibold text-[#2F9E67] flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Resume uploaded ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-[#66736B] mb-3">
                Upload your resume PDF or paste resume text to generate personalized candidate questions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-[#E2E5E1] hover:bg-[#F1F3EF] rounded-lg text-xs font-semibold text-[#17201B] shadow-xs">
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-[#087F5B]" />
                  Choose PDF / Text File
                  <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileUpload} className="hidden" />
                </label>
                <input
                  type="text"
                  placeholder="Or paste key skills/projects snippet here..."
                  value={resumeText}
                  onChange={e => {
                    setResumeText(e.target.value);
                    if (e.target.value.trim().length > 0) setResumeUploaded(true);
                  }}
                  className="flex-1 w-full px-3 py-2 bg-white border border-[#E2E5E1] rounded-lg text-xs focus:outline-none focus:border-[#087F5B]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#E2E5E1] flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Initializing AI Interviewer...' : 'Start Interview'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
