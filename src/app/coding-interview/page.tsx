'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  Code,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Terminal,
  Send,
  RotateCcw,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { CODING_PROBLEMS } from '@/services/coding/problemBank';
import { CodingLanguage, CodingProblem } from '@/services/coding/types';

function CodingInterviewContent() {
  const searchParams = useSearchParams();
  const [problems] = useState<CodingProblem[]>(CODING_PROBLEMS);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    const pParam = searchParams.get('problem');
    if (pParam && CODING_PROBLEMS.some(item => item.id === pParam)) {
      return pParam;
    }
    return CODING_PROBLEMS[0].id;
  });
  const [language, setLanguage] = useState<CodingLanguage>('python');
  const [code, setCode] = useState<string>(() => {
    const pParam = searchParams.get('problem');
    const initialProb = (pParam && CODING_PROBLEMS.find(item => item.id === pParam)) || CODING_PROBLEMS[0];
    return initialProb.starterTemplates.python;
  });

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'problem' | 'hints' | 'solution'>('problem');

  const currentProblem = problems.find(p => p.id === selectedProblemId) || problems[0];

  // Update starter code when problem or language changes
  const handleProblemChange = (probId: string) => {
    setSelectedProblemId(probId);
    const p = problems.find(item => item.id === probId) || problems[0];
    setCode(p.starterTemplates[language] || '');
    setResult(null);
    setShowHints(false);
    setShowSolution(false);
    setSelectedTab('problem');
  };

  const handleLanguageChange = (lang: CodingLanguage) => {
    setLanguage(lang);
    setCode(currentProblem.starterTemplates[lang] || '');
    setResult(null);
  };

  const handleResetCode = () => {
    if (confirm('Reset editor to original problem template?')) {
      setCode(currentProblem.starterTemplates[language] || '');
      setResult(null);
    }
  };

  const handleExecute = async (isSubmission: boolean = false) => {
    if (isSubmission) setSubmitting(true);
    else setRunning(true);
    setResult(null);

    try {
      const res = await fetch('/api/coding/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          problemId: currentProblem.id,
          isSubmission,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert('Execution failed: ' + (err.message || 'Unknown network error'));
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17201B] flex flex-col">
      <Navbar />

      {/* Coding Header / Problem Navigator */}
      <div className="bg-white border-b border-[#E2E5E1] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#DDF3EA] text-[#087F5B] flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#66736B] uppercase tracking-wider">Problem Bank</span>
                <span className="text-xs text-[#E2E5E1]">•</span>
                <span className="text-xs font-semibold text-[#087F5B]">{currentProblem.category}</span>
              </div>
              <h1 className="text-base font-bold text-[#17201B] flex items-center space-x-2">
                <span>{currentProblem.title}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    currentProblem.difficulty === 'Easy'
                      ? 'bg-[#DDF3EA] text-[#087F5B]'
                      : currentProblem.difficulty === 'Medium'
                      ? 'bg-[#FFF1D6] text-[#D99A2B]'
                      : 'bg-[#D64545]/10 text-[#D64545]'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Problem Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-[#66736B] whitespace-nowrap">Switch Problem:</label>
            <select
              value={selectedProblemId}
              onChange={(e) => handleProblemChange(e.target.value)}
              className="bg-[#F7F6F2] border border-[#E2E5E1] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#17201B] focus:outline-none focus:border-[#087F5B]"
            >
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty} - {p.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Description & Tabs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E5E1] shadow-xs flex flex-col overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E2E5E1] bg-[#F7F6F2]">
            <button
              onClick={() => setSelectedTab('problem')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center space-x-1.5 ${
                selectedTab === 'problem'
                  ? 'border-[#087F5B] text-[#087F5B] bg-white'
                  : 'border-transparent text-[#66736B] hover:text-[#17201B]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setSelectedTab('hints')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center space-x-1.5 ${
                selectedTab === 'hints'
                  ? 'border-[#087F5B] text-[#087F5B] bg-white'
                  : 'border-transparent text-[#66736B] hover:text-[#17201B]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hints ({currentProblem.hints.length})</span>
            </button>
            <button
              onClick={() => setSelectedTab('solution')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center space-x-1.5 ${
                selectedTab === 'solution'
                  ? 'border-[#087F5B] text-[#087F5B] bg-white'
                  : 'border-transparent text-[#66736B] hover:text-[#17201B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solution & Logic</span>
            </button>
          </div>

          {/* Tab 1: Problem Description */}
          {selectedTab === 'problem' && (
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {currentProblem.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#F1F3EF] text-[#66736B] font-medium text-[11px]">
                    {t}
                  </span>
                ))}
              </div>

              {/* Problem Statement */}
              <div className="space-y-3 text-[#17201B] whitespace-pre-line text-sm">
                {currentProblem.statement}
              </div>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#17201B] uppercase tracking-wider text-[11px]">Examples</h3>
                {currentProblem.examples.map((ex) => (
                  <div key={ex.exampleNum} className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] space-y-1">
                    <p className="font-bold text-[#17201B]">Example {ex.exampleNum}:</p>
                    <p className="font-mono text-[#66736B]">Input: {ex.input}</p>
                    <p className="font-mono text-[#087F5B] font-bold">Output: {ex.output}</p>
                    {ex.explanation && (
                      <p className="text-[11px] text-[#66736B]">Explanation: {ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-[#17201B] uppercase tracking-wider text-[11px]">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-[#66736B]">
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i}><code className="bg-[#F1F3EF] px-1 py-0.5 rounded text-[#17201B] font-mono">{c}</code></li>
                  ))}
                </ul>
              </div>

              {/* Edge Cases */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-[#17201B] uppercase tracking-wider text-[11px]">Edge Cases to Consider</h3>
                <ul className="list-disc list-inside space-y-1 text-[#66736B]">
                  {currentProblem.edgeCases.map((ec, i) => (
                    <li key={i}>{ec}</li>
                  ))}
                </ul>
              </div>

              {/* Complexity Expectations */}
              <div className="p-3.5 rounded-xl bg-[#DDF3EA]/40 border border-[#087F5B]/20 space-y-1 text-xs">
                <span className="font-bold text-[#087F5B] block">Expected Complexity Target:</span>
                <p className="text-[#17201B]">Time: <strong>{currentProblem.timeComplexityExpected}</strong></p>
                <p className="text-[#17201B]">Space: <strong>{currentProblem.spaceComplexityExpected}</strong></p>
              </div>
            </div>
          )}

          {/* Tab 2: Hints */}
          {selectedTab === 'hints' && (
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <h3 className="font-bold text-[#17201B] text-sm">Step-by-Step Guided Hints</h3>
              <p className="text-[#66736B]">Try solving on your own first before revealing subsequent hints.</p>
              
              <div className="space-y-3">
                {currentProblem.hints.map((hint, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1] space-y-1">
                    <span className="font-bold text-[#087F5B]">Hint {idx + 1}:</span>
                    <p className="text-[#17201B]">{hint}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Solution Explanation */}
          {selectedTab === 'solution' && (
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs leading-relaxed">
              <h3 className="font-bold text-[#17201B] text-sm">Optimal Approach & Analysis</h3>
              <div className="p-4 rounded-xl bg-[#F1F3EF] border border-[#E2E5E1] text-[#17201B] space-y-3">
                <p>{currentProblem.solutionExplanation}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF1D6] border border-[#D99A2B]/30 text-xs text-[#17201B]">
                <strong className="text-[#D99A2B] block mb-1">Interview Tip:</strong>
                Always communicate the brute force approach first and explain its complexity bottleneck before jumping into the optimal data structure.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Results */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Editor Container */}
          <div className="bg-white rounded-2xl border border-[#E2E5E1] p-4 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#E2E5E1] pb-3 gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#17201B] uppercase tracking-wider">Language:</span>
                {(['python', 'javascript', 'java', 'cpp'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                      language === lang ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B] hover:text-[#17201B]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}

                <button
                  onClick={handleResetCode}
                  title="Reset template"
                  className="p-1.5 text-[#66736B] hover:text-[#17201B] hover:bg-[#F1F3EF] rounded-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExecute(false)}
                  disabled={running || submitting}
                  className="px-4 py-2 bg-[#F1F3EF] hover:bg-[#E2E5E1] text-[#17201B] font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#087F5B]" />
                  <span>{running ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={() => handleExecute(true)}
                  disabled={running || submitting}
                  className="px-5 py-2 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>

            {/* Monospace Code Editor */}
            <div className="relative rounded-xl overflow-hidden bg-[#17201B] p-1">
              <textarea
                rows={16}
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full p-4 bg-transparent text-[#DDF3EA] font-mono text-xs focus:outline-none leading-relaxed resize-none"
                spellCheck={false}
              />
            </div>

            {/* Honest Execution Environment Status Badge */}
            <div className="flex items-center justify-between text-[11px] text-[#66736B] px-1">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>
                  Execution Engine:{' '}
                  <strong>
                    {language === 'javascript'
                      ? 'Isolated JS Sandbox (node:vm)'
                      : language === 'python'
                      ? 'Isolated Python 3.11 Process'
                      : 'Static Code Analysis Mode'}
                  </strong>
                </span>
              </span>
              <span>Entry: <code className="bg-[#F1F3EF] px-1 py-0.5 rounded text-[#17201B]">{currentProblem.entryFunctionName}()</code></span>
            </div>

            {/* Execution Sandbox Results */}
            {result && (
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#087F5B]/30 space-y-3 animate-fade-in text-xs">
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-white font-bold text-[11px] ${
                        result.status === 'Accepted' ? 'bg-[#2F9E67]' : 'bg-[#D64545]'
                      }`}
                    >
                      {result.status}
                    </span>
                    <span className="font-semibold text-[#17201B]">
                      {result.passedTests} / {result.totalTests} Tests Passed
                    </span>
                    <span className="text-[#66736B]">
                      • Runtime: {result.executionTimeMs}ms
                    </span>
                  </div>

                  <div className="flex space-x-3 text-[11px] font-semibold text-[#087F5B]">
                    <span>Time: {result.timeComplexity}</span>
                    <span>Space: {result.spaceComplexity}</span>
                  </div>
                </div>

                {/* Honest mode disclosure notice */}
                {result.isSimulated && (
                  <div className="p-2.5 rounded-lg bg-[#FFF1D6] border border-[#D99A2B]/30 text-[11px] text-[#17201B]">
                    <strong>Static Evaluation Mode:</strong> {result.stdout || 'Evaluated via AST / structural code validation.'}
                  </div>
                )}

                {/* Test Cases Output */}
                <div className="space-y-1.5 pt-2 border-t border-[#E2E5E1]">
                  {result.testCases.map((tc: any) => (
                    <div
                      key={tc.id}
                      className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        tc.passed ? 'bg-white border-[#E2E5E1]' : 'bg-[#D64545]/5 border-[#D64545]/30'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#17201B]">
                          Test #{tc.id} {tc.isHidden ? '(Hidden Test Case)' : ''}:
                        </span>
                        {!tc.isHidden ? (
                          <div className="font-mono text-[11px] text-[#66736B]">
                            Input: {tc.input} | Expected: {tc.expectedOutput} | Actual: {tc.actualOutput}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#66736B] italic">
                            (Hidden test case inputs and outputs are obscured)
                          </div>
                        )}
                        {tc.error && (
                          <div className="text-[11px] text-[#D64545] font-mono">
                            {tc.error}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-[#66736B]">{tc.runtimeMs}ms</span>
                        <span
                          className={`font-bold text-xs ${
                            tc.passed ? 'text-[#2F9E67]' : 'text-[#D64545]'
                          }`}
                        >
                          {tc.passed ? 'Passed ✓' : 'Failed ✗'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CodingInterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#087F5B] border-t-transparent rounded-full animate-spin" /></div>}>
      <CodingInterviewContent />
    </Suspense>
  );
}
