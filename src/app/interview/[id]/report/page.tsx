'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ScoreRing from '@/components/ScoreRing';
import DemoModeBadge from '@/components/DemoModeBadge';
import {
  Award,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code
} from 'lucide-react';

export default function InterviewReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const interviewId = resolvedParams.id;

  const [interview, setInterview] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    // Fetch interview and report via idempotent GET
    fetch(`/api/interviews/${interviewId}/complete`)
      .then(r => r.json())
      .then(data => {
        if (data.interview) setInterview(data.interview);
        if (data.report) setReport(data.report);
      })
      .catch(err => console.error('Fetch report error:', err))
      .finally(() => setLoading(false));
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#087F5B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#66736B]">Synthesizing Performance Report...</p>
        </div>
      </div>
    );
  }

  const overallScore = report?.overallPercentage ?? interview?.score ?? 75;
  const skillScores = report?.skillScores || {
    technicalKnowledge: 75,
    communication: 75,
    problemSolving: 75,
    answerRelevance: 75,
    confidence: 75,
  };

  const strengths = report?.strengths || [
    'Clear conceptual foundations on core technical topics.',
    'Systematic problem-solving orientation.',
  ];

  const areasToImprove = report?.areasToImprove || [
    'Elaborate further on edge cases and failure modes.',
    'Deepen understanding of scalability trade-offs.',
  ];

  const aiRecommendation = report?.aiRecommendation ||
    'Solid performance! Continue practicing scenario-based problem solving and targeted coding challenges to solidify candidate readiness.';

  const practiceQuestions = report?.suggestedPracticeQuestions || [];
  const weakTopics = report?.weakTopics || [];
  const questionsList = interview?.questions || [];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Banner Header */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Interview Performance Report</span>
              </div>
              <DemoModeBadge />
            </div>
            <h1 className="text-3xl font-bold text-[#17201B]">
              {interview?.jobRole || 'Software Developer'} Simulation
            </h1>
            <p className="text-xs text-[#66736B]">
              {interview?.experienceLevel || 'Fresher'} • {interview?.interviewType} Interview • {questionsList.length} Questions Evaluated
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <ScoreRing score={overallScore} maxScore={100} size={110} strokeWidth={9} label="Overall Score" />
          </div>
        </div>

        {/* AI Synthesis & Summary Recommendation */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#087F5B] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#087F5B]" />
            <span>AI Evaluator Assessment</span>
          </div>
          <p className="text-sm text-[#17201B] leading-relaxed">
            {aiRecommendation}
          </p>
        </div>

        {/* 5 Core Skill Competencies */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#17201B] flex items-center space-x-2">
            <Brain className="w-4 h-4 text-[#087F5B]" />
            <span>Competency Score Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Technical Knowledge', val: skillScores.technicalKnowledge },
              { label: 'Problem Solving', val: skillScores.problemSolving },
              { label: 'Answer Relevance', val: skillScores.answerRelevance },
              { label: 'Communication', val: skillScores.communication },
              { label: 'Confidence & Delivery', val: skillScores.confidence },
            ].map((skill, idx) => (
              <div key={idx} className="bg-[#F7F6F2] p-4 rounded-xl border border-[#E2E5E1] flex flex-col justify-between space-y-2">
                <span className="text-xs font-medium text-[#66736B]">{skill.label}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-[#087F5B]">{skill.val}%</span>
                </div>
                <div className="w-full bg-[#E2E5E1] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#087F5B] h-full rounded-full transition-all duration-700"
                    style={{ width: `${skill.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Growth Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#087F5B] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths Observed</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#17201B]">
              {strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-[#087F5B] font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#D99A2B] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Prioritized Areas for Improvement</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#17201B]">
              {areasToImprove.map((area: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-[#D99A2B] font-bold mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Evaluation Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#17201B] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#087F5B]" />
            <span>Question-by-Question Detailed Review</span>
          </h3>

          <div className="space-y-3">
            {questionsList.map((q: any, idx: number) => {
              const isExpanded = expandedQuestion === idx;
              let parsedFeedback = { whatDidWell: [], whatToImprove: [], missingConcepts: [] };
              try {
                if (q.feedback) parsedFeedback = JSON.parse(q.feedback);
              } catch {}

              return (
                <div key={q.id || idx} className="rounded-xl border border-[#E2E5E1] overflow-hidden bg-[#F7F6F2]">
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#F1F3EF] transition-colors"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#087F5B]">Q{idx + 1}</span>
                        <span className="text-xs text-[#66736B]">• {q.category || 'Technical'}</span>
                        {q.isFollowUp && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1D6] text-[#D99A2B]">
                            Adaptive Follow-Up
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#17201B] line-clamp-1">{q.question}</p>
                    </div>

                    <div className="flex items-center space-x-3 whitespace-nowrap">
                      <span className="text-xs font-bold text-[#087F5B]">
                        {q.score !== null ? `${q.score} / 10` : 'N/A'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#66736B]" /> : <ChevronDown className="w-4 h-4 text-[#66736B]" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-[#E2E5E1] space-y-4 text-xs">
                      <div>
                        <span className="font-bold text-[#66736B] uppercase tracking-wider text-[11px] block mb-1">
                          Candidate Answer:
                        </span>
                        <p className="p-3 bg-[#F7F6F2] rounded-lg text-[#17201B] whitespace-pre-line leading-relaxed font-mono">
                          {q.answer || '(No answer provided)'}
                        </p>
                      </div>

                      {/* Dimension Scores */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { name: 'Tech Accuracy', val: q.technicalAccuracy },
                          { name: 'Relevance', val: q.relevance },
                          { name: 'Completeness', val: q.completeness },
                          { name: 'Clarity', val: q.clarity },
                          { name: 'Problem Solving', val: q.problemSolving },
                          { name: 'Communication', val: q.communication },
                        ].map((d, i) => (
                          <div key={i} className="p-2 rounded bg-[#F7F6F2] text-center border border-[#E2E5E1]">
                            <span className="text-[10px] text-[#66736B] block truncate">{d.name}</span>
                            <span className="text-xs font-bold text-[#087F5B]">{d.val ?? 0}</span>
                          </div>
                        ))}
                      </div>

                      {/* Ideal Answer */}
                      {q.idealAnswer && (
                        <div className="p-3 rounded-lg bg-[#DDF3EA]/30 border border-[#087F5B]/20">
                          <span className="font-bold text-[#087F5B] block mb-1">Ideal Model Answer:</span>
                          <p className="text-[#17201B] whitespace-pre-line">{q.idealAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Targeted Weak Topics & Practice Recommendations */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#17201B] flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#087F5B]" />
              <span>Targeted Practice Drills</span>
            </h3>
            <Link
              href="/practice"
              className="text-xs font-semibold text-[#087F5B] hover:underline flex items-center"
            >
              <span>Practice Mode</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceQuestions.map((pq: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#DDF3EA] text-[#087F5B]">
                      {pq.topic}
                    </span>
                    <span className="text-[11px] text-[#66736B]">• {pq.difficulty}</span>
                  </div>
                  <p className="text-xs font-bold text-[#17201B] leading-snug">{pq.question}</p>
                </div>

                <Link
                  href={`/practice?topic=${encodeURIComponent(pq.topic)}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#087F5B] hover:text-[#066749]"
                >
                  <span>Launch Targeted Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/coding-interview"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E2E5E1] bg-white hover:bg-[#F1F3EF] text-xs font-semibold text-[#17201B] text-center flex items-center justify-center space-x-2 shadow-xs"
          >
            <Code className="w-4 h-4 text-[#087F5B]" />
            <span>Practice Coding Challenges</span>
          </Link>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/interview/new"
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#087F5B] hover:bg-[#066749] text-white text-xs font-semibold text-center flex items-center justify-center space-x-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Interview</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
