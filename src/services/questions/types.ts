export type QuestionCategory =
  | 'Conceptual with Practical Application'
  | 'Scenario-Based Problem Solving'
  | 'Debugging & Root-Cause Analysis'
  | 'Design & Architecture Decisions'
  | 'Project-Based Technical Discussion'
  | 'Trade-Off Analysis'
  | 'Coding & Algorithmic Reasoning'
  | 'Behavioral (STAR Method)'
  | 'SQL & Database Problem Solving'
  | 'Follow-Up Probing';

export type ExperienceLevel = 'Fresher' | '1-2 Years' | '3-5 Years' | '5+ Years';

export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Mixed';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface EvaluationRubricCriteria {
  technicalAccuracy: string;
  relevance: string;
  completeness: string;
  clarity: string;
  problemSolving: string;
  communication: string;
}

export interface StructuredQuestion {
  id: string;
  jobRole: string; // e.g. 'Software Developer', 'Backend Developer', 'Frontend Developer', 'All'
  experienceLevel: ExperienceLevel | 'All';
  interviewType: InterviewType;
  topic: string;
  subtopic: string;
  difficulty: DifficultyLevel;
  category: QuestionCategory;
  question: string;
  scenario?: string;
  constraints?: string[];
  expectedCompetencies: string[];
  evaluationRubric: EvaluationRubricCriteria;
  expectedDepth: string; // e.g. "30-90 seconds direct conceptual explanation"
  idealAnswer: string;
  followUpObjectives?: string;
  possibleFollowUps?: Array<{
    triggerCondition: string; // e.g. "high_score", "low_score", "mentioned_indexing", "general"
    question: string;
    objective: string;
    difficulty: DifficultyLevel;
  }>;
}

export interface QuestionFilter {
  jobRole?: string;
  experienceLevel?: string;
  interviewType?: InterviewType;
  difficulty?: string;
  category?: QuestionCategory;
  topic?: string;
  excludeIds?: string[];
  weakTopics?: string[];
}

