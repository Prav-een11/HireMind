'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Code2,
  FileSearch,
  Zap,
  Award,
  Layers,
  BarChart3,
  Bot
} from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-[#E2E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DDF3EA] border border-[#087F5B]/20 text-[#087F5B] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen AI Interview Coach</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#17201B] leading-[1.15]">
                Practice smarter. <br />
                Interview better. <br />
                <span className="text-[#087F5B] underline decoration-[#DDF3EA] underline-offset-8">Get hired.</span>
              </h1>

              <p className="text-lg text-[#66736B] max-w-2xl leading-relaxed">
                Practice realistic technical, HR, and coding interviews with our adaptive AI interviewer. Receive instant 6-dimensional evaluation, pinpoint weak areas, and generate custom practice sessions.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  href="/interview/new"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-[#087F5B] hover:bg-[#066749] rounded-xl transition-all shadow-sm group"
                >
                  Start Mock Interview
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-[#17201B] bg-white border border-[#E2E5E1] hover:bg-[#F1F3EF] rounded-xl transition-colors shadow-xs"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#E2E5E1]/80">
                <div>
                  <p className="text-2xl font-bold text-[#17201B]">10K+</p>
                  <p className="text-xs font-medium text-[#66736B]">Practice Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#17201B]">50+</p>
                  <p className="text-xs font-medium text-[#66736B]">Job Roles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#17201B]">6 Metric</p>
                  <p className="text-xs font-medium text-[#66736B]">AI Evaluation</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#17201B]">94%</p>
                  <p className="text-xs font-medium text-[#66736B]">Candidate Success</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Product Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-md relative">
                {/* Interview Preview Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E5E1]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#17201B]">Software Developer Simulation</h4>
                      <p className="text-xs text-[#66736B]">Adaptive Difficulty • Question 3 of 5</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FFF1D6] text-[#D99A2B]">
                    Medium Level
                  </span>
                </div>

                {/* AI Question Box */}
                <div className="mt-4 p-4 rounded-xl bg-[#F1F3EF] border border-[#E2E5E1]">
                  <p className="text-xs font-semibold text-[#087F5B] uppercase tracking-wider mb-1">
                    AI Question
                  </p>
                  <p className="text-sm font-medium text-[#17201B]">
                    &ldquo;Explain how indexing works in relational databases and how it impacts read versus write performance.&rdquo;
                  </p>
                </div>

                {/* Candidate Answer Box */}
                <div className="mt-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E5E1]">
                  <p className="text-xs font-semibold text-[#66736B] uppercase tracking-wider mb-1">
                    Candidate Response
                  </p>
                  <p className="text-xs text-[#17201B] leading-relaxed">
                    &ldquo;Database indexes use B+ tree structures to quickly locate rows without doing a full table scan. This makes SELECT queries O(log N), but slows down INSERT and UPDATE operations because the tree must rebalance.&rdquo;
                  </p>
                </div>

                {/* AI Score & Feedback Preview */}
                <div className="mt-4 p-4 rounded-xl bg-[#DDF3EA]/50 border border-[#087F5B]/20 flex items-center space-x-4">
                  <ScoreRing score={8.6} maxScore={10} size={64} strokeWidth={6} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#087F5B]">AI Feedback</span>
                      <span className="text-[10px] font-semibold text-[#2F9E67] bg-white px-2 py-0.5 rounded-full border border-[#E2E5E1]">
                        + Difficulty Increased
                      </span>
                    </div>
                    <p className="text-xs text-[#17201B] mt-1 truncate">
                      ✓ Strong technical accuracy on B+ trees & time complexity.
                    </p>
                    <p className="text-[11px] text-[#66736B] mt-0.5">
                      Recommendation: Mention index types like Hash & Composite.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#E2E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-[#087F5B] uppercase tracking-widest mb-2">
              Four Simple Steps
            </h2>
            <h3 className="text-3xl font-bold text-[#17201B] tracking-tight">
              How HireMind Prepares You For Success
            </h3>
            <p className="text-sm text-[#66736B] mt-3">
              A structured AI-driven workflow that mimics real tech & HR interview panels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: '01',
                title: 'Set Your Goal',
                desc: 'Select your target job role (e.g. Software Developer, Data Scientist), experience level, and interview type.',
                icon: Layers,
              },
              {
                num: '02',
                title: 'Take an AI Interview',
                desc: 'Answer dynamic questions spoken or typed in real-time. Upload your resume to get tailored questions.',
                icon: Bot,
              },
              {
                num: '03',
                title: 'Get Evaluated',
                desc: 'Receive immediate multi-dimensional feedback across technical accuracy, clarity, problem solving, and confidence.',
                icon: BarChart3,
              },
              {
                num: '04',
                title: 'Improve & Repeat',
                desc: 'Track weak technical topics, attempt generated practice questions, and monitor your score progression.',
                icon: TrendingUp,
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F7F6F2] p-6 rounded-2xl border border-[#E2E5E1] flex flex-col justify-between hover:border-[#087F5B]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-[#087F5B] font-mono">{step.num}</span>
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#17201B] border border-[#E2E5E1]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-[#17201B] mb-2">{step.title}</h4>
                    <p className="text-xs text-[#66736B] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#F7F6F2] border-b border-[#E2E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-[#087F5B] uppercase tracking-widest mb-2">
              Comprehensive Platform
            </h2>
            <h3 className="text-3xl font-bold text-[#17201B] tracking-tight">
              Designed For High-Stakes Career Success
            </h3>
            <p className="text-sm text-[#66736B] mt-3">
              Everything you need to master technical interviews, coding challenges, and HR rounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'AI Mock Interviews',
                desc: 'Realistic interview simulations tailored to over 50+ computer science and tech job roles.',
                icon: Bot,
              },
              {
                title: 'Adaptive Questions',
                desc: 'Question difficulty dynamically adjusts in real-time based on your previous answer score.',
                icon: Zap,
              },
              {
                title: 'Instant Multi-Metric Feedback',
                desc: 'Detailed breakdown across technical accuracy, relevance, completeness, clarity, and problem solving.',
                icon: ShieldCheck,
              },
              {
                title: 'Skill & Weak Area Analysis',
                desc: 'Automatically identifies topics where you struggle (e.g. DBMS, OS) and generates targeted drills.',
                icon: Brain,
              },
              {
                title: 'Resume-Based Interviews',
                desc: 'Extracts skills, projects, and education from your resume to generate relevant candidate questions.',
                icon: FileSearch,
              },
              {
                title: 'Coding Interview Studio',
                desc: 'Practice algorithms with an in-browser code editor, safe sandbox execution, and test cases.',
                icon: Code2,
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-semibold text-[#17201B] mb-2">{feat.title}</h4>
                  <p className="text-xs text-[#66736B] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#F1F3EF] rounded-3xl p-12 border border-[#E2E5E1]">
          <h2 className="text-3xl font-bold text-[#17201B]">
            Ready to ace your next technical interview?
          </h2>
          <p className="text-sm text-[#66736B] mt-3 max-w-xl mx-auto">
            Start a free AI mock interview session in under 30 seconds. No credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/interview/new"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#087F5B] hover:bg-[#066749] rounded-xl transition-all shadow-sm"
            >
              Start Free AI Interview
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
