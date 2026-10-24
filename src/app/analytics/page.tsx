'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  BarChart3,
  TrendingUp,
  Brain,
  AlertTriangle,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const scoreTrends = data?.scoreTrends || [
    { name: 'Interview 1', score: 62 },
    { name: 'Interview 2', score: 68 },
    { name: 'Interview 3', score: 74 },
    { name: 'Interview 4', score: 81 },
  ];

  const skillData = data?.skillData || [
    { subject: 'Technical Knowledge', score: 82 },
    { subject: 'Communication', score: 76 },
    { subject: 'Problem Solving', score: 80 },
    { subject: 'Answer Relevance', score: 85 },
    { subject: 'Confidence', score: 74 },
  ];

  const weakestSkills = data?.weakestSkills || ['Confidence', 'Communication'];
  const insight = data?.insight || 'Your interview performance has shown steady improvement across technical knowledge and communication clarity.';

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Candidate Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17201B]">Interview Performance & Skill Growth</h1>
          <p className="text-xs text-[#66736B]">Track your score trajectories, skill strengths, and automatically identified focus areas.</p>
        </div>

        {/* AI Insight Box */}
        <div className="bg-[#DDF3EA]/50 rounded-2xl border border-[#087F5B]/20 p-6 flex items-start space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#087F5B] text-white flex items-center justify-center shrink-0 font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#087F5B] uppercase tracking-wider">AI Improvement Insights</h3>
            <p className="text-sm text-[#17201B] mt-1 leading-relaxed">{insight}</p>
          </div>
        </div>

        {/* Overall Progress Score Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#17201B]">Overall Score Trend</h3>
              <p className="text-xs text-[#66736B]">Percentage progression across completed interview simulations</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B]">
              Score Growth: +19%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E5E1" vertical={false} />
                <XAxis dataKey="name" stroke="#66736B" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#66736B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E5E1', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#087F5B"
                  strokeWidth={3}
                  dot={{ fill: '#087F5B', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown Chart & Weakest Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
            <h3 className="text-base font-bold text-[#17201B] mb-1">5-Dimension Skill Mastery</h3>
            <p className="text-xs text-[#66736B] mb-4">Bar chart of evaluated skill scores out of 100%</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E5E1" vertical={false} />
                  <XAxis dataKey="subject" stroke="#66736B" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#66736B" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E5E1', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" fill="#087F5B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#17201B]">Weakest Skills & Focus Areas</h3>
            <p className="text-xs text-[#66736B]">Targeted areas flagged for additional practice</p>

            <div className="space-y-3 pt-2">
              {weakestSkills.map((skill: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FFF1D6] border border-[#D99A2B]/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-[#D99A2B]" />
                    <span className="text-xs font-bold text-[#17201B]">{skill}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#D99A2B] bg-white px-2.5 py-0.5 rounded-full border border-[#E2E5E1]">
                    Practice Needed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
