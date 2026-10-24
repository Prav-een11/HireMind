import { AI_PROMPTS } from './prompts';
import {
  QuestionRequest,
  GeneratedQuestion,
  AnswerEvaluationRequest,
  AnswerEvaluation,
  FinalReportRequest,
  FinalReportResult,
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
} from './types';
import { MockAIProvider } from './mockProvider';

export class GeminiAIProvider {
  private static getApiKey(): string | null {
    const key = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '') return null;
    return key.trim();
  }

  private static async callGemini(prompt: string): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('AI_API_KEY not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('Empty response from Gemini API');

    // Parse JSON
    const cleanJson = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  static async generateQuestion(req: QuestionRequest): Promise<GeneratedQuestion> {
    try {
      if (req.isFollowUp && req.parentQuestion) {
        const prompt = AI_PROMPTS.generateFollowUp({
          jobRole: req.jobRole,
          parentQuestion: req.parentQuestion.question,
          candidateAnswer: req.candidatePreviousAnswer || '',
          answerScore: req.candidatePreviousScore ?? 7.0,
          subtopic: req.parentQuestion.subtopic,
        });
        const parsed = await this.callGemini(prompt);
        return {
          question: parsed.question,
          category: parsed.category || 'Follow-Up Probing',
          subtopic: parsed.subtopic || req.parentQuestion.subtopic,
          difficulty: parsed.difficulty || 'Medium',
          expectedCompetencies: parsed.expectedCompetencies || req.parentQuestion.expectedCompetencies,
          expectedDepth: parsed.expectedDepth || '45-90 seconds focused follow-up',
          idealAnswer: parsed.idealAnswer,
          followUpObjectives: parsed.followUpObjectives,
          isFollowUp: true,
          parentQuestionId: req.parentQuestion.id,
          suggestedPoints: parsed.expectedCompetencies || ['Direct answer to follow-up probe'],
        };
      }

      const prompt = AI_PROMPTS.generateQuestion({
        jobRole: req.jobRole,
        experienceLevel: req.experienceLevel,
        interviewType: req.interviewType,
        difficulty: req.difficulty,
        questionIndex: req.questionIndex,
        totalQuestions: req.totalQuestions,
        weakTopics: req.weakTopics,
        previousQuestionIds: req.previousQuestionIds,
        previousQuestionTopics: req.previousQuestionTopics,
        resumeContext: req.resumeContext,
      });

      const parsed = await this.callGemini(prompt);
      return {
        question: parsed.question || 'Explain your approach to software architecture and testing.',
        category: parsed.category || 'Scenario-Based Problem Solving',
        subtopic: parsed.subtopic,
        difficulty: (parsed.difficulty as any) || req.difficulty,
        expectedCompetencies: parsed.expectedCompetencies || [],
        evaluationRubric: parsed.evaluationRubric,
        expectedDepth: parsed.expectedDepth,
        constraints: parsed.constraints,
        suggestedPoints: parsed.suggestedPoints || [],
        idealAnswer: parsed.idealAnswer,
        followUpObjectives: parsed.followUpObjectives,
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Mock Provider:', err);
      return MockAIProvider.generateQuestion(req);
    }
  }

  static async evaluateAnswer(req: AnswerEvaluationRequest): Promise<AnswerEvaluation> {
    try {
      const prompt = AI_PROMPTS.evaluateAnswer({
        jobRole: req.jobRole,
        experienceLevel: req.experienceLevel,
        interviewType: req.interviewType,
        difficulty: req.difficulty,
        question: req.question,
        userAnswer: req.userAnswer,
        category: req.category,
        subtopic: req.subtopic,
      });

      const parsed = await this.callGemini(prompt);
      return {
        overallScore: Number(parsed.overallScore) || 7.5,
        dimensions: {
          technicalAccuracy: Number(parsed.dimensions?.technicalAccuracy) || 7.5,
          relevance: Number(parsed.dimensions?.relevance) || 8.0,
          completeness: Number(parsed.dimensions?.completeness) || 7.0,
          clarity: Number(parsed.dimensions?.clarity) || 7.5,
          problemSolving: Number(parsed.dimensions?.problemSolving) || 7.5,
          communication: Number(parsed.dimensions?.communication) || 8.0,
        },
        whatDidWell: parsed.whatDidWell || ['Clear conceptual explanation.'],
        whatToImprove: parsed.whatToImprove || ['Incorporate more concrete failure modes and edge cases.'],
        missingConcepts: parsed.missingConcepts || [],
        specificCorrections: parsed.specificCorrections || [],
        idealAnswer: parsed.idealAnswer || 'A structured response covering key points.',
        nextDifficultySuggestion: parsed.nextDifficultySuggestion || 'Medium',
        topicTag: parsed.topicTag || req.subtopic || req.category || 'General CS',
        shouldAskFollowUp: parsed.shouldAskFollowUp ?? (Number(parsed.overallScore) >= 6.5),
        followUpGoal: parsed.followUpGoal,
      };
    } catch (err) {
      console.warn('Gemini API evaluation failed, falling back to Mock Provider:', err);
      return MockAIProvider.evaluateAnswer(req);
    }
  }

  static async generateFinalReport(req: FinalReportRequest): Promise<FinalReportResult> {
    try {
      const summaryText = req.questions.map((q, i) => `Q${i + 1}: ${q.question}\nCategory: ${q.category || 'General'}\nScore: ${q.score}/10\nAnswer: ${q.userAnswer}`).join('\n\n');
      const prompt = AI_PROMPTS.finalReport({
        jobRole: req.jobRole,
        interviewType: req.interviewType,
        questionsSummary: summaryText,
      });

      const parsed = await this.callGemini(prompt);
      return parsed as FinalReportResult;
    } catch (err) {
      console.warn('Gemini API report generation failed, falling back to Mock Provider:', err);
      return MockAIProvider.generateFinalReport(req);
    }
  }

  static async analyzeResume(req: ResumeAnalysisRequest): Promise<ResumeAnalysisResult> {
    try {
      const prompt = AI_PROMPTS.analyzeResume(req.resumeText, req.jobDescription);
      const parsed = await this.callGemini(prompt);
      return parsed as ResumeAnalysisResult;
    } catch (err) {
      console.warn('Gemini API resume analysis failed, falling back to Mock Provider:', err);
      return MockAIProvider.analyzeResume(req);
    }
  }
}
