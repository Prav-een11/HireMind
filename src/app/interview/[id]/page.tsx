'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ScoreRing from '@/components/ScoreRing';
import DemoModeBadge from '@/components/DemoModeBadge';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Send,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bot,
  Brain,
  HelpCircle,
  Lightbulb,
  Code,
  FileText,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function ActiveInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const interviewId = resolvedParams.id;

  const [interview, setInterview] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'javascript' | 'sql' | 'java'>('python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [nextQuestion, setNextQuestion] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer & Voice states
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Load interview details from API
  useEffect(() => {
    fetch(`/api/interviews/${interviewId}`)
      .then(r => r.json())
      .then(data => {
        if (data.interview) {
          setInterview(data.interview);
          const qs = data.interview.questions || [];
          const unanswered = qs.find((q: any) => !q.answer);
          const activeQ = unanswered || qs[qs.length - 1];
          setCurrentQuestion(activeQ);

          // If coding or SQL question, default to code mode
          const cat = activeQ?.category?.toLowerCase() || '';
          if (cat.includes('coding') || cat.includes('sql') || cat.includes('algorithm')) {
            setIsCodeMode(true);
            if (cat.includes('sql')) setCodeLanguage('sql');
          }
        }
      })
      .catch(err => console.error('Fetch interview error:', err))
      .finally(() => setLoading(false));
  }, [interviewId]);

  // Interview timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Text-to-Speech (AI Voice)
  const speakQuestion = () => {
    if (!currentQuestion?.question || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text (Voice Answer)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert('Speech Recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserAnswer(prev => prev + ' ' + transcript);
    };
    recognition.start();
  };

  const handleSubmitAnswer = async () => {
    // Combine written explanation and code if code mode was used
    let finalAnswer = userAnswer.trim();
    if (codeAnswer.trim()) {
      finalAnswer += `\n\n\`\`\`${codeLanguage}\n${codeAnswer.trim()}\n\`\`\``;
    }

    if (!finalAnswer.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/interviews/${interviewId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: finalAnswer,
          totalQuestions: interview?.totalQuestions || 5,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit answer');

      setEvaluation(data.evaluation);
      setNextQuestion(data.nextQuestion);
      setIsCompleted(data.isCompleted);
    } catch (err: any) {
      alert(err.message || 'Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedNext = async () => {
    if (isCompleted) {
      // Complete interview in DB and navigate to report
      await fetch(`/api/interviews/${interviewId}/complete`, { method: 'POST' });
      router.push(`/interview/${interviewId}/report`);
    } else if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setUserAnswer('');
      setCodeAnswer('');
      setEvaluation(null);
      setNextQuestion(null);

      const cat = nextQuestion?.category?.toLowerCase() || '';
      if (cat.includes('coding') || cat.includes('sql') || cat.includes('algorithm')) {
        setIsCodeMode(true);
        if (cat.includes('sql')) setCodeLanguage('sql');
      } else {
        setIsCodeMode(false);
      }
    }
  };

  const handleEndEarly = async () => {
    if (confirm('Are you sure you want to end this interview session early?')) {
      await fetch(`/api/interviews/${interviewId}/complete`, { method: 'POST' });
      router.push(`/interview/${interviewId}/report`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#087F5B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#66736B]">Preparing AI Interviewer...</p>
        </div>
      </div>
    );
  }

  const questionsList = interview?.questions || [];
  const currentIdx = questionsList.findIndex((q: any) => q.id === currentQuestion?.id) + 1 || 1;
  const totalQuestionsCount = interview?.totalQuestions || Math.max(5, questionsList.length);

  // Depth guidance text based on category
  const getExpectedDepthGuide = () => {
    if (currentQuestion?.expectedDepth) return currentQuestion.expectedDepth;
    const cat = currentQuestion?.category?.toLowerCase() || '';
    if (cat.includes('behavioral') || cat.includes('star')) {
      return '1–3 minutes: structured STAR response (Situation, Task, Action, Result) with concrete details.';
    }
    if (cat.includes('coding') || cat.includes('algorithmic')) {
      return 'Explanation, optimal approach, implementation, time/space complexity, and edge cases.';
    }
    if (cat.includes('scenario') || cat.includes('debugging')) {
      return '1–3 minutes: systematic diagnostic breakdown, identifying root causes and verification steps.';
    }
    if (cat.includes('design') || cat.includes('architecture')) {
      return 'Structured discussion of requirements, components, trade-offs, and failure handling.';
    }
    return '30–90 seconds: concise, direct explanation of core mechanics and practical trade-offs.';
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col text-[#17201B]">
      {/* Active Interview Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E5E1] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg bg-[#087F5B] text-white flex items-center justify-center font-bold text-base">
            H
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-[#17201B]">
                {interview?.jobRole || 'Software Developer'} Interview
              </h2>
              <DemoModeBadge />
            </div>
            <p className="text-xs text-[#66736B]">
              {interview?.experienceLevel || 'Fresher'} • {interview?.interviewType} • {interview?.difficulty} Mode
            </p>
          </div>
        </div>

        {/* Question Counter & Timer */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-2 bg-[#F1F3EF] px-3 py-1.5 rounded-lg border border-[#E2E5E1] text-xs font-semibold text-[#17201B]">
            <Clock className="w-4 h-4 text-[#087F5B]" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <div className="text-xs font-semibold text-[#66736B]">
            Question <span className="text-[#087F5B] font-bold">{currentIdx}</span> of {totalQuestionsCount}
          </div>

          <button
            onClick={handleEndEarly}
            className="px-3 py-1.5 text-xs font-semibold text-[#D64545] bg-[#D64545]/10 hover:bg-[#D64545]/20 rounded-lg border border-[#D64545]/20 transition-colors flex items-center"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> End Interview
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-[#E2E5E1] h-1.5">
        <div
          className="bg-[#087F5B] h-1.5 transition-all duration-500"
          style={{ width: `${(currentIdx / totalQuestionsCount) * 100}%` }}
        />
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: AI Interviewer Avatar & Controls */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-center">
            {/* AI Avatar */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-[#DDF3EA] border-2 border-[#087F5B] text-[#087F5B] mx-auto flex items-center justify-center text-4xl font-extrabold shadow-sm">
                <Bot className="w-12 h-12 text-[#087F5B]" />
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#2F9E67] border-2 border-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#17201B]">HireMind AI Panel</h3>
              <p className="text-xs text-[#66736B] mt-0.5">
                Senior Technical Interviewer • {interview?.experienceLevel || 'Fresher'} Level
              </p>
            </div>

            {/* Current Difficulty & Topic Badge */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DDF3EA] text-[#087F5B]">
                {currentQuestion?.category || 'Core Engineering'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFF1D6] text-[#D99A2B]">
                {currentQuestion?.difficulty || 'Medium'} Difficulty
              </span>
            </div>
          </div>

          {/* Answer Depth Expectations Guide */}
          <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#E2E5E1] space-y-2 text-xs">
            <span className="font-bold text-[#17201B] uppercase tracking-wider block text-[11px]">
              Expected Answer Depth
            </span>
            <p className="text-[#66736B] leading-relaxed">
              {getExpectedDepthGuide()}
            </p>
            <p className="text-[11px] text-[#087F5B] font-semibold italic">
              Tip: Conciseness and technical accuracy are rewarded over empty length.
            </p>
          </div>

          {/* Voice Controls */}
          <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#E2E5E1] space-y-3">
            <h4 className="text-xs font-bold text-[#17201B] uppercase tracking-wider">
              Audio & Speech Controls
            </h4>
            
            <div className="flex items-center justify-between">
              <button
                onClick={speakQuestion}
                className="flex-1 py-2 px-3 bg-white border border-[#E2E5E1] hover:bg-[#F1F3EF] rounded-lg text-xs font-semibold text-[#17201B] flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-[#087F5B] animate-pulse' : 'text-[#66736B]'}`} />
                <span>{isSpeaking ? 'Speaking...' : 'Listen Question'}</span>
              </button>
            </div>

            <button
              onClick={toggleListening}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs ${
                isListening
                  ? 'bg-[#D64545] text-white animate-pulse'
                  : 'bg-[#087F5B] text-white hover:bg-[#066749]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Stop Recording Answer' : '🎙 Start Voice Answer'}</span>
            </button>

            {!speechSupported && (
              <p className="text-[11px] text-[#66736B] text-center italic">
                Voice unavailable in browser. Text input enabled.
              </p>
            )}
          </div>
        </div>

        {/* Center Panel: Active Question & Answer Area */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs space-y-3">
            {/* Follow-up Banner if applicable */}
            {currentQuestion?.isFollowUp && (
              <div className="p-3 rounded-xl bg-[#FFF1D6] border border-[#D99A2B]/30 flex items-center space-x-2 text-xs font-semibold text-[#D99A2B]">
                <Brain className="w-4 h-4 text-[#D99A2B]" />
                <span>⚡ Adaptive Follow-Up Question: Probing reasoning from your previous response</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#087F5B] uppercase tracking-wider flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5" /> Interview Question {currentIdx}
              </span>
              <span className="text-xs text-[#66736B] font-medium">{currentQuestion?.subtopic || currentQuestion?.category}</span>
            </div>

            <h2 className="text-xl font-bold text-[#17201B] leading-relaxed">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* Answer Input Area */}
          {!evaluation ? (
            <div className="bg-white rounded-2xl border border-[#E2E5E1] p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* Header with Mode Toggle */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsCodeMode(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                        !isCodeMode ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B] hover:text-[#17201B]'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Text Explanation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCodeMode(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                        isCodeMode ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B] hover:text-[#17201B]'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Code / SQL Editor</span>
                    </button>
                  </div>

                  <span className="text-xs text-[#66736B]">
                    {userAnswer.length} chars • {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Text Explanation Input */}
                <textarea
                  rows={isCodeMode ? 4 : 9}
                  placeholder="Explain your approach, reasoning, algorithm, trade-offs, and edge cases..."
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  className="w-full p-4 bg-[#F7F6F2] border border-[#E2E5E1] rounded-xl text-sm text-[#17201B] focus:outline-none focus:border-[#087F5B] leading-relaxed resize-none mb-3"
                />

                {/* Embedded Code Editor when Code Mode is active */}
                {isCodeMode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#17201B]">Language:</span>
                        {(['python', 'javascript', 'sql', 'java'] as const).map(l => (
                          <button
                            type="button"
                            key={l}
                            onClick={() => setCodeLanguage(l)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                              codeLanguage === l ? 'bg-[#087F5B] text-white' : 'bg-[#F1F3EF] text-[#66736B]'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#66736B]">Monospace Code Input</span>
                    </div>

                    <textarea
                      rows={8}
                      placeholder={`// Write your ${codeLanguage.toUpperCase()} solution, query, or implementation here...`}
                      value={codeAnswer}
                      onChange={e => setCodeAnswer(e.target.value)}
                      className="w-full p-4 bg-[#17201B] text-[#DDF3EA] font-mono text-xs rounded-xl focus:outline-none leading-relaxed resize-none"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2E5E1]">
                <button
                  type="button"
                  onClick={() => setUserAnswer('I would like to skip this question and move to the next topic.')}
                  className="px-4 py-2 text-xs font-semibold text-[#66736B] hover:text-[#17201B] hover:bg-[#F1F3EF] rounded-lg transition-colors"
                >
                  Skip Question
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || (!userAnswer.trim() && !codeAnswer.trim())}
                  className="px-6 py-3 bg-[#087F5B] hover:bg-[#066749] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating Answer...' : 'Submit Answer'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Dimensional Evaluation & Feedback Section */
            <div className="bg-white rounded-2xl border border-[#087F5B]/30 p-6 shadow-md space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E5E1] pb-4 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#087F5B] text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Answer Evaluated</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17201B]">Multi-Dimensional Performance Feedback</h3>
                </div>

                {/* Overall Question Score Ring */}
                <div className="flex items-center space-x-4">
                  <ScoreRing score={evaluation.overallScore} maxScore={10} size={72} strokeWidth={6} label="Question Score" />
                </div>
              </div>

              {/* 6 Scoring Dimension Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Technical Accuracy', val: evaluation.dimensions.technicalAccuracy },
                  { label: 'Relevance', val: evaluation.dimensions.relevance },
                  { label: 'Completeness', val: evaluation.dimensions.completeness },
                  { label: 'Clarity', val: evaluation.dimensions.clarity },
                  { label: 'Problem Solving', val: evaluation.dimensions.problemSolving },
                  { label: 'Communication', val: evaluation.dimensions.communication },
                ].map((dim, idx) => (
                  <div key={idx} className="bg-[#F7F6F2] p-3 rounded-xl border border-[#E2E5E1]">
                    <span className="text-[11px] font-medium text-[#66736B] block truncate">{dim.label}</span>
                    <span className="text-base font-bold text-[#087F5B]">{dim.val} / 10</span>
                  </div>
                ))}
              </div>

              {/* Adaptive Engine Adjustment Banner */}
              <div className="p-3.5 rounded-xl bg-[#FFF1D6] border border-[#D99A2B]/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#D99A2B] flex items-center">
                  <Brain className="w-4 h-4 mr-1.5 text-[#D99A2B]" /> Adaptive Engine Action:
                </span>
                <span className="font-bold text-[#17201B]">
                  Next Question Difficulty: {evaluation.nextDifficultySuggestion}
                </span>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#DDF3EA]/30 p-4 rounded-xl border border-[#087F5B]/20">
                  <h4 className="text-xs font-bold text-[#087F5B] uppercase tracking-wider mb-2 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> What You Did Well
                  </h4>
                  <ul className="text-xs text-[#17201B] space-y-1.5 list-disc list-inside">
                    {evaluation.whatDidWell.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#FFF1D6]/40 p-4 rounded-xl border border-[#D99A2B]/20">
                  <h4 className="text-xs font-bold text-[#D99A2B] uppercase tracking-wider mb-2 flex items-center">
                    <Lightbulb className="w-3.5 h-3.5 mr-1" /> What You Could Improve
                  </h4>
                  <ul className="text-xs text-[#17201B] space-y-1.5 list-disc list-inside">
                    {evaluation.whatToImprove.map((imp: string, i: number) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Concepts & Specific Corrections if present */}
              {evaluation.missingConcepts && evaluation.missingConcepts.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E5E1]">
                  <h4 className="text-xs font-bold text-[#17201B] uppercase tracking-wider mb-1.5 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-[#D99A2B]" /> Missing Concepts / Unaddressed Nuances
                  </h4>
                  <ul className="text-xs text-[#66736B] list-disc list-inside space-y-1">
                    {evaluation.missingConcepts.map((mc: string, idx: number) => (
                      <li key={idx}>{mc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal Answer Showcase */}
              <div className="p-4 rounded-xl bg-[#F1F3EF] border border-[#E2E5E1]">
                <h4 className="text-xs font-bold text-[#17201B] uppercase tracking-wider mb-1">
                  Ideal Model Answer & Solution
                </h4>
                <p className="text-xs text-[#17201B] leading-relaxed whitespace-pre-line font-mono bg-white p-3 rounded-lg border border-[#E2E5E1] mt-2">
                  {evaluation.idealAnswer}
                </p>
              </div>

              {/* Next Question / Finish Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleProceedNext}
                  className="px-8 py-3.5 bg-[#087F5B] hover:bg-[#066749] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>{isCompleted ? 'View Final Report' : 'Proceed to Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
