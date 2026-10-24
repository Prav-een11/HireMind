import { MockAIProvider } from './mockProvider';
import { GeminiAIProvider } from './geminiProvider';
import {
  QuestionRequest,
  GeneratedQuestion,
  AnswerEvaluationRequest,
  AnswerEvaluation,
  FinalReportRequest,
  FinalReportResult,
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
  PracticeQuestionsRequest,
} from './types';

export class AIService {
  /**
   * Checks if a valid external AI_API_KEY is configured.
   * Never exposes keys to browser - executed server-side.
   */
  static isDemoMode(): boolean {
    const key = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    return !key || key.trim() === '';
  }

  static async generateInterviewQuestion(req: QuestionRequest): Promise<GeneratedQuestion> {
    if (this.isDemoMode()) {
      return MockAIProvider.generateQuestion(req);
    }
    return GeminiAIProvider.generateQuestion(req);
  }

  static async evaluateAnswer(req: AnswerEvaluationRequest): Promise<AnswerEvaluation> {
    if (this.isDemoMode()) {
      return MockAIProvider.evaluateAnswer(req);
    }
    return GeminiAIProvider.evaluateAnswer(req);
  }

  static async generateFinalReport(req: FinalReportRequest): Promise<FinalReportResult> {
    if (this.isDemoMode()) {
      return MockAIProvider.generateFinalReport(req);
    }
    return GeminiAIProvider.generateFinalReport(req);
  }

  static async analyzeResume(req: ResumeAnalysisRequest): Promise<ResumeAnalysisResult> {
    if (this.isDemoMode()) {
      return MockAIProvider.analyzeResume(req);
    }
    return GeminiAIProvider.analyzeResume(req);
  }

  static async generatePracticeQuestions(req: PracticeQuestionsRequest) {
    return MockAIProvider.generatePracticeQuestions(req);
  }
}
