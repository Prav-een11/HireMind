'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Brain,
  Database,
  Cpu,
  Globe,
  Code,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { CODING_PROBLEMS } from '@/services/coding/problemBank';

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'Data Structures';

  const topics = [
    { name: 'Data Structures', icon: Layers, desc: 'Arrays, Trees, Graphs, Hash Maps, Stacks & Queues' },
    { name: 'Algorithms', icon: Code, desc: 'Sorting, Searching, Dynamic Programming, Greedy' },
    { name: 'DBMS', icon: Database, desc: 'SQL, Normalization, Indexing, Transactions, ACID' },
    { name: 'Operating Systems', icon: Cpu, desc: 'Processes, Threads, Virtual Memory, Deadlocks' },
    { name: 'Computer Networks', icon: Globe, desc: 'TCP/IP, HTTP/S, DNS, OSI Model, Sockets' },
    { name: 'OOP', icon: Brain, desc: 'Inheritance, Polymorphism, Encapsulation, Abstraction' },
    { name: 'Java', icon: Code, desc: 'JVM, Multithreading, Collections Framework, GC' },
    { name: 'Python', icon: Code, desc: 'Decorators, Generators, Memory Management, AsyncIO' },
    { name: 'JavaScript', icon: Code, desc: 'Event Loop, Closures, Promises, Prototypes, ES6' },
    { name: 'React', icon: Code, desc: 'Hooks, Virtual DOM, State Management, Fiber Engine' },
    { name: 'SQL', icon: Database, desc: 'Complex Joins, Subqueries, CTEs, Window Functions' },
    { name: 'System Design', icon: Layers, desc: 'Load Balancers, Caching, Microservices, Sharding' },
  ];

  const [userSelectedTopic, setUserSelectedTopic] = useState<string | null>(null);
  const selectedTopic = userSelectedTopic || initialTopic;
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  const setSelectedTopic = (topic: string) => setUserSelectedTopic(topic);

  const handleStartPractice = async () => {
    setLoading(true);
    setExpandedAnswers({});
    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty,
          count,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate practice');
      setQuestions(data.questions);
    } catch (err: any) {
      alert(err.message || 'Practice generation failed');
    } finally {
      setLoading(false);
    }
  };

  // Find matching coding problems from problem bank
  const matchingCodingProblems = CODING_PROBLEMS.filter(p =>
    p.tags.some(tag => tag.toLowerCase().includes(selectedTopic.toLowerCase())) ||
    p.category.toLowerCase().includes(selectedTopic.toLowerCase()) ||
    p.title.toLowerCase().includes(selectedTopic.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Targeted Practice Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17201B]">Computer Science Topic Drills & Coding</h1>
          <p className="text-xs text-[#66736B]">Select a core engineering topic to launch conceptual drills and real coding challenges.</p>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.name;
            return (
              <button
                key={t.name}
                onClick={() => setSelectedTopic(t.name)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#087F5B] bg-[#DDF3EA]/40 shadow-xs'
                    : 'border-[#E2E5E1] bg-white hover:bg-[#F1F3EF]'
                }`}
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#17201B]">{t.name}</h4>
                  <p className="text-[11px] text-[#66736B] mt-1 leading-snug">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#66736B] uppercase mb-1">Active Topic</label>
              <span className="text-sm font-bold text-[#087F5B]">{selectedTopic}</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#66736B] uppercase mb-1">Difficulty</label>
              <div className="flex space-x-1">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      difficulty === d ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#66736B] uppercase mb-1">Count</label>
              <div className="flex space-x-1">
                {[3, 5].map(c => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      count === c ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B]'
                    }`}
                  >
                    {c} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartPractice}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Generating Drills...' : 'Generate Practice Drills'}</span>
          </button>
        </div>

        {/* Matching Coding Challenges Shortcut */}
        {matchingCodingProblems.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-[#E2E5E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17201B] flex items-center space-x-2">
                <Code className="w-4 h-4 text-[#087F5B]" />
                <span>Related Algorithmic Challenges for {selectedTopic}</span>
              </h3>
              <Link href="/coding-interview" className="text-xs font-semibold text-[#087F5B] hover:underline flex items-center">
                <span>View Full Workbench</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingCodingProblems.map((prob) => (
                <div key={prob.id} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DDF3EA] text-[#087F5B]">
                        {prob.difficulty}
                      </span>
                      <span className="text-[11px] text-[#66736B]">{prob.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#17201B]">{prob.title}</h4>
                    <p className="text-[11px] text-[#66736B] line-clamp-2 mt-1">{prob.statement}</p>
                  </div>

                  <Link
                    href={`/coding-interview?problem=${prob.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#087F5B] hover:text-[#066749]"
                  >
                    <span>Solve in Code Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Showcase */}
        {questions.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-[#087F5B]/30 shadow-md space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-[#17201B]">
              Practice Drills: {selectedTopic} ({difficulty} Level)
            </h3>

            <div className="space-y-4">
              {questions.map((q: any, i: number) => {
                const isRevealed = expandedAnswers[q.id];
                return (
                  <div key={q.id || i} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#087F5B] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Question {i + 1}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF1D6] text-[#D99A2B] text-[11px]">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-[#17201B] leading-relaxed">{q.question}</p>

                    <div className="pt-2 border-t border-[#E2E5E1] flex items-center justify-between">
                      <button
                        onClick={() => setExpandedAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="text-xs font-bold text-[#087F5B] hover:text-[#066749] flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isRevealed ? 'Hide Model Approach' : 'View Model Approach & Trade-offs'}</span>
                      </button>

                      <Link
                        href="/interview/new"
                        className="text-xs font-semibold text-[#66736B] hover:text-[#17201B]"
                      >
                        Start Mock Interview →
                      </Link>
                    </div>

                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-white border border-[#087F5B]/20 text-xs text-[#17201B] space-y-2 animate-fade-in">
                        <span className="font-bold text-[#087F5B] block">Expected Core Points:</span>
                        <p className="text-[#66736B] leading-relaxed">
                          Define core principles, illustrate with concrete technical examples, analyze time and space complexity, and state the engineering trade-offs.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PracticeModePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#087F5B] border-t-transparent rounded-full animate-spin" /></div>}>
      <PracticeContent />
    </Suspense>
  );
}
