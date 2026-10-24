'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, Filter, ArrowRight, History, Calendar, Award } from 'lucide-react';

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetch('/api/interviews')
      .then(r => r.json())
      .then(data => {
        if (data.interviews) setInterviews(data.interviews);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredInterviews = interviews.filter(inv => {
    const matchesSearch = inv.jobRole.toLowerCase().includes(search.toLowerCase()) ||
                          inv.interviewType.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || inv.jobRole === roleFilter;
    const matchesType = typeFilter === 'All' || inv.interviewType === typeFilter;
    return matchesSearch && matchesRole && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Title */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-1">
              <History className="w-3.5 h-3.5" />
              <span>Interview History</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17201B]">Past Interview Sessions</h1>
            <p className="text-xs text-[#66736B]">View all completed AI mock interviews, reports, and evaluations</p>
          </div>

          <Link
            href="/interview/new"
            className="px-4 py-2.5 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Start New Session
          </Link>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E5E1] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#66736B]" />
            <input
              type="text"
              placeholder="Search role or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-xs focus:outline-none focus:border-[#087F5B]"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-xs focus:outline-none focus:border-[#087F5B]"
            >
              <option value="All">All Job Roles</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg text-xs focus:outline-none focus:border-[#087F5B]"
            >
              <option value="All">All Types</option>
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Coding">Coding</option>
            </select>
          </div>
        </div>

        {/* Interviews Table / Grid */}
        <div className="bg-white rounded-2xl border border-[#E2E5E1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F3EF] text-[#66736B] uppercase tracking-wider font-semibold border-b border-[#E2E5E1]">
                <tr>
                  <th className="px-6 py-3.5">Job Role</th>
                  <th className="px-6 py-3.5">Experience</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Difficulty</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5E1] text-[#17201B]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#66736B]">
                      Loading interview history...
                    </td>
                  </tr>
                ) : filteredInterviews.length > 0 ? (
                  filteredInterviews.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-[#F7F6F2]">
                      <td className="px-6 py-4 font-semibold text-[#17201B]">{inv.jobRole}</td>
                      <td className="px-6 py-4 text-[#66736B]">{inv.experienceLevel || 'Fresher'}</td>
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
                          View Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#66736B]">
                      No completed interviews match your search. Start a new session!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
