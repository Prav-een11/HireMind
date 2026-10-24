export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Mixed';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Adaptive';

export interface PracticeQuestionsRequest {
  topic: string;
  difficulty: string;
  count: number;
}

export interface QuestionRequest {
  jobRole: string;
  experienceLevel?: string; // 'Fresher', '1-2 Years', '3-5 Years', '5+ Years'
  interviewType: InterviewType;
  difficulty: string; // 'Easy' | 'Medium' | 'Hard'
  questionIndex: number;
  totalQuestions: number;
  previousScores?: number[];
  weakTopics?: string[];
  previousQuestionIds?: string[];
  previousQuestionTopics?: string[];
  resumeContext?: string;
  parentQuestion?: any;
  candidatePreviousAnswer?: string;
  candidatePreviousScore?: number;
  isFollowUp?: boolean;
}

export interface GeneratedQuestion {
  questionId?: string;
  question: string;
  category: string; // e.g., "DBMS", "Operating Systems", "Scenario-Based Problem Solving", "Coding & Algorithmic Reasoning"
  subtopic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedCompetencies?: string[];
  evaluationRubric?: any;
  expectedDepth?: string;
  constraints?: string[];
  testCases?: any;
  followUpObjectives?: string;
  isFollowUp?: boolean;
  parentQuestionId?: string;
  suggestedPoints?: string[];
  idealAnswer?: string;
}

export interface AnswerEvaluationRequest {
  jobRole: string;
  experienceLevel?: string;
  interviewType: string;
  difficulty: string;
  question: string;
  userAnswer: string;
  category?: string;
  subtopic?: string;
  expectedCompetencies?: string[];
  rubric?: any;
  expectedDepth?: string;
  resumeContext?: string;
  isFollowUp?: boolean;
}

export interface EvaluationDimensions {
  technicalAccuracy: number; // 0 - 10
  relevance: number;         // 0 - 10
  completeness: number;      // 0 - 10
  clarity: number;           // 0 - 10
  problemSolving: number;    // 0 - 10
  communication: number;     // 0 - 10
}

export interface AnswerEvaluation {
  overallScore: number;      // 0 - 10
  dimensions: EvaluationDimensions;
  whatDidWell: string[];
  whatToImprove: string[];
  missingConcepts?: string[];
  specificCorrections?: string[];
  idealAnswer: string;
  nextDifficultySuggestion: 'Easy' | 'Medium' | 'Hard';
  topicTag: string;
  shouldAskFollowUp?: boolean;
  followUpGoal?: string;
}

export interface FinalReportRequest {
  jobRole: string;
  experienceLevel?: string;
  interviewType: string;
  questions: Array<{
    question: string;
    category?: string;
    subtopic?: string;
    userAnswer: string;
    score: number;
    evaluation: AnswerEvaluation;
  }>;
}

export interface FinalReportResult {
  overallPercentage: number;
  skillScores: {
    technicalKnowledge: number; // 0 - 100
    communication: number;
    problemSolving: number;
    answerRelevance: number;
    confidence: number;
  };
  strengths: string[];
  areasToImprove: string[];
  aiRecommendation: string;
  weakTopics: string[];
  suggestedPracticeQuestions: Array<{
    id: string;
    topic: string;
    question: string;
    difficulty: string;
  }>;
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
}

export interface ResumeAnalysisResult {
  resumeScore: number; // 0 - 100
  matchPercentage?: number;
  extractedSkills: string[];
  education: string[];
  experienceHighlights: string[];
  projects: string[];
  matchingSkills: string[];
  missingSkills: string[];
  feedbackSummary: string;
  suggestedQuestions: string[];
}
