'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ScoreRing from '@/components/ScoreRing';
import {
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Brain,
  ArrowRight,
  FileText,
  Clock,
  ChevronRight,
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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
      fetch('/api/interviews').then(r => r.json()),
    ])
      .then(([userRes, analyticsRes, interviewsRes]) => {
        if (userRes.user) setUser(userRes.user);
        if (analyticsRes.metrics) setAnalytics(analyticsRes);
        if (interviewsRes.interviews) setInterviews(interviewsRes.interviews);
      })
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = analytics?.metrics || {
    interviewsCompleted: 4,
    averageScore: 74,
    bestScore: 85,
    currentStreak: 3,
  };

  const scoreTrends = analytics?.scoreTrends || [
    { name: 'Interview 1', score: 62 },
    { name: 'Interview 2', score: 68 },
    { name: 'Interview 3', score: 74 },
    { name: 'Interview 4', score: 81 },
  ];

  const skillData = analytics?.skillData || [
    { subject: 'Technical Knowledge', score: 82 },
    { subject: 'Communication', score: 76 },
    { subject: 'Problem Solving', score: 80 },
    { subject: 'Answer Relevance', score: 85 },
    { subject: 'Confidence', score: 74 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-[#17201B]">
              Welcome back, {user?.name || 'Alex'}!
            </h1>
            <p className="text-xs text-[#66736B] mt-1">
              Ready for your next interview simulation? Your performance target is <span className="font-semibold text-[#087F5B]">{user?.targetRole || 'Software Developer'}</span>.
            </p>
          </div>

          <Link
            href="/interview/new"
            className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-[#087F5B] hover:bg-[#066749] rounded-xl transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start New Interview
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E2E5E1] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#66736B]">Interviews Completed</p>
              <h3 className="text-2xl font-bold text-[#17201B] mt-1">{metrics.interviewsCompleted}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E5E1] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#66736B]">Average Score</p>
              <h3 className="text-2xl font-bold text-[#17201B] mt-1">{metrics.averageScore}%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E5E1] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#66736B]">Best Score</p>
              <h3 className="text-2xl font-bold text-[#17201B] mt-1">{metrics.bestScore}%</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF1D6] text-[#D99A2B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E5E1] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#66736B]">Current Streak</p>
              <h3 className="text-2xl font-bold text-[#17201B] mt-1">{metrics.currentStreak} Days</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FFF1D6] text-[#D99A2B] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Score Trend Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E2E5E1]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#17201B]">Performance History</h3>
                <p className="text-xs text-[#66736B]">Score percentage progression across recent interviews</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B]">
                +19% Improvement
              </span>
            </div>

            <div className="h-64 w-full">
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

          {/* Skill Breakdown */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E2E5E1]">
            <h3 className="text-base font-semibold text-[#17201B]">Skill Dimension Breakdown</h3>
            <p className="text-xs text-[#66736B] mb-4">Aggregated performance across 5 key dimensions</p>

            <div className="space-y-3.5">
              {skillData.map((item: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-[#17201B]">{item.subject}</span>
                    <span className="text-[#087F5B] font-semibold">{item.score}%</span>
                  </div>
                  <div className="w-full bg-[#F1F3EF] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#087F5B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Interviews Table */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] overflow-hidden">
          <div className="p-6 border-b border-[#E2E5E1] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#17201B]">Recent Interview Sessions</h3>
              <p className="text-xs text-[#66736B]">Review completed AI simulations and performance reports</p>
            </div>
            <Link href="/history" className="text-xs font-semibold text-[#087F5B] hover:underline flex items-center">
              View All History <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F3EF] text-[#66736B] uppercase tracking-wider font-semibold border-b border-[#E2E5E1]">
                <tr>
                  <th className="px-6 py-3">Job Role</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5E1] text-[#17201B]">
                {interviews.length > 0 ? (
                  interviews.slice(0, 5).map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-[#F7F6F2]">
                      <td className="px-6 py-4 font-semibold text-[#17201B]">{inv.jobRole}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] font-medium">
                          {inv.interviewType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#66736B]">{inv.difficulty}</td>
                      <td className="px-6 py-4 font-bold text-[#087F5B]">
                        {inv.score ? `${Math.round(inv.score)}%` : 'In Progress'}
                      </td>
                      <td className="px-6 py-4 text-[#66736B]">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/interview/${inv.id}/report`}
                          className="inline-flex items-center text-[#087F5B] font-semibold hover:underline"
                        >
                          View Report <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-[#F7F6F2]">
                      <td className="px-6 py-4 font-semibold text-[#17201B]">Software Developer</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] font-medium">Technical</span></td>
                      <td className="px-6 py-4 text-[#66736B]">Adaptive</td>
                      <td className="px-6 py-4 font-bold text-[#087F5B]">82%</td>
                      <td className="px-6 py-4 text-[#66736B]">Sep 24</td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/interview/new" className="text-[#087F5B] font-semibold hover:underline">View Report</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F7F6F2]">
                      <td className="px-6 py-4 font-semibold text-[#17201B]">Frontend Developer</td>
                      <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] font-medium">Technical</span></td>
                      <td className="px-6 py-4 text-[#66736B]">Medium</td>
                      <td className="px-6 py-4 font-bold text-[#087F5B]">74%</td>
                      <td className="px-6 py-4 text-[#66736B]">Sep 20</td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/interview/new" className="text-[#087F5B] font-semibold hover:underline">View Report</Link>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
