'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ScoreRing from '@/components/ScoreRing';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
  ArrowRight,
  Brain,
  FileSearch
} from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText((event.target?.result as string) || `Extracted text from ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setAnalyzing(true);

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setAnalysis(data.analysis);
    } catch (err: any) {
      alert(err.message || 'Analysis error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateInterviewFromResume = () => {
    // Navigate to interview new page with prefilled resume context
    router.push('/interview/new');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-1">
            <FileSearch className="w-3.5 h-3.5" />
            <span>AI Resume ATS Analyzer</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17201B]">Resume Screening & Job Description Matcher</h1>
          <p className="text-xs text-[#66736B]">Analyze ATS score, extract skills, compare against target job descriptions, and generate tailored interview questions.</p>
        </div>

        {/* Input Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Column */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#17201B]">1. Upload or Paste Resume</h3>

            <div className="p-4 rounded-xl bg-[#F7F6F2] border border-dashed border-[#E2E5E1] text-center space-y-2">
              <Upload className="w-8 h-8 text-[#087F5B] mx-auto" />
              <p className="text-xs font-semibold text-[#17201B]">Select PDF / Document File</p>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-[#E2E5E1] hover:bg-[#F1F3EF] rounded-lg text-xs font-semibold text-[#087F5B] shadow-xs">
                Browse Files
                <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-1">
                Or Paste Resume Plain Text
              </label>
              <textarea
                rows={6}
                placeholder="Paste work history, skills, education, and projects snippet here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full p-3 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs text-[#17201B] focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17201B] uppercase tracking-wider mb-1">
                Target Job Description (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Paste target job posting responsibilities and qualifications to calculate match percentage..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="w-full p-3 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-xs text-[#17201B] focus:outline-none focus:border-[#087F5B]"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText.trim()}
              className="w-full py-3 bg-[#087F5B] hover:bg-[#066749] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Analyzing ATS Score...' : 'Analyze Resume'}</span>
            </button>
          </div>

          {/* Right Column: Results Showcase */}
          <div className="lg:col-span-6 space-y-6">
            {analysis ? (
              <div className="bg-white p-6 rounded-2xl border border-[#087F5B]/30 shadow-md space-y-6 animate-fade-in">
                {/* Score Header */}
                <div className="flex items-center justify-around border-b border-[#E2E5E1] pb-6">
                  <ScoreRing score={analysis.resumeScore} maxScore={100} size={90} strokeWidth={7} label="Resume Score" />
                  {analysis.matchPercentage !== undefined && (
                    <ScoreRing score={analysis.matchPercentage} maxScore={100} size={90} strokeWidth={7} label="Job Match %" />
                  )}
                </div>

                {/* Matching vs Missing Skills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#DDF3EA]/40 border border-[#087F5B]/20">
                    <h4 className="text-xs font-bold text-[#087F5B] uppercase tracking-wider mb-2 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.matchingSkills.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#087F5B] border border-[#E2E5E1]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFF1D6]/40 border border-[#D99A2B]/20">
                    <h4 className="text-xs font-bold text-[#D99A2B] uppercase tracking-wider mb-2 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.missingSkills.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#D99A2B] border border-[#E2E5E1]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback Summary */}
                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1]">
                  <h4 className="text-xs font-bold text-[#17201B] uppercase tracking-wider mb-1">
                    ATS Audit Feedback
                  </h4>
                  <p className="text-xs text-[#66736B] leading-relaxed">
                    {analysis.feedbackSummary}
                  </p>
                </div>

                {/* Suggested Resume Questions */}
                <div>
                  <h4 className="text-xs font-bold text-[#17201B] uppercase tracking-wider mb-2">
                    Resume-Based Interview Questions
                  </h4>
                  <ul className="space-y-2 text-xs text-[#17201B] list-disc list-inside">
                    {analysis.suggestedQuestions.map((q: string, i: number) => (
                      <li key={i} className="leading-relaxed">{q}</li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleGenerateInterviewFromResume}
                  className="w-full py-3.5 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>Generate Interview Questions From Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-[#E2E5E1] shadow-xs text-center space-y-3 flex flex-col items-center justify-center min-h-[400px]">
                <FileText className="w-12 h-12 text-[#66736B]" />
                <h3 className="text-base font-bold text-[#17201B]">No Resume Analyzed Yet</h3>
                <p className="text-xs text-[#66736B] max-w-sm">
                  Upload your resume PDF or paste text on the left to view your ATS score breakdown and generate custom interview questions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
