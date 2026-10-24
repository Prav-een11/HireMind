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
import { REALISTIC_QUESTION_BANK, QuestionBankEngine } from '../questions/questionBank';
import { CODING_PROBLEMS } from '../coding/problemBank';

export class MockAIProvider {
  /**
   * Generates or selects a realistic interview question based on role, experience,
   * difficulty, and session tracking.
   */
  static generateQuestion(req: QuestionRequest): GeneratedQuestion {
    // If this request is explicitly for an adaptive follow-up
    if (req.isFollowUp && req.parentQuestion) {
      const followUp = QuestionBankEngine.generateFollowUp(
        req.parentQuestion,
        req.candidatePreviousAnswer || '',
        req.candidatePreviousScore ?? 7.0
      );
      return {
        questionId: followUp.id,
        question: followUp.question,
        category: followUp.category,
        subtopic: followUp.subtopic,
        difficulty: followUp.difficulty,
        expectedCompetencies: followUp.expectedCompetencies,
        evaluationRubric: followUp.evaluationRubric,
        expectedDepth: followUp.expectedDepth,
        constraints: followUp.constraints,
        idealAnswer: followUp.idealAnswer,
        followUpObjectives: followUp.followUpObjectives,
        isFollowUp: true,
        parentQuestionId: req.parentQuestion.id,
        suggestedPoints: ['Directly address previous trade-off', 'Provide concrete edge-case analysis'],
      };
    }

    // Select structured question from realistic question bank
    const selected = QuestionBankEngine.selectQuestion({
      jobRole: req.jobRole || 'Software Developer',
      experienceLevel: req.experienceLevel || 'Fresher',
      interviewType: req.interviewType || 'Technical',
      difficulty: req.difficulty || 'Medium',
      excludeIds: req.previousQuestionIds || [],
      weakTopics: req.weakTopics || [],
    });

    if (selected) {
      return {
        questionId: selected.id,
        question: selected.question,
        category: selected.category,
        subtopic: selected.subtopic,
        difficulty: selected.difficulty,
        expectedCompetencies: selected.expectedCompetencies,
        evaluationRubric: selected.evaluationRubric,
        expectedDepth: selected.expectedDepth,
        constraints: selected.constraints,
        idealAnswer: selected.idealAnswer,
        followUpObjectives: selected.followUpObjectives,
        isFollowUp: false,
        suggestedPoints: selected.expectedCompetencies,
      };
    }

    // Safe fallback to first question
    const defaultQ = REALISTIC_QUESTION_BANK[0];
    return {
      questionId: defaultQ.id,
      question: defaultQ.question,
      category: defaultQ.category,
      subtopic: defaultQ.subtopic,
      difficulty: defaultQ.difficulty,
      expectedCompetencies: defaultQ.expectedCompetencies,
      evaluationRubric: defaultQ.evaluationRubric,
      expectedDepth: defaultQ.expectedDepth,
      idealAnswer: defaultQ.idealAnswer,
      suggestedPoints: defaultQ.expectedCompetencies,
    };
  }

  /**
   * Evaluates a candidate's answer across 6 dimensions without artificially rewarding length.
   * A concise, correct answer receives top marks, while shallow or inaccurate responses are flagged.
   */
  static evaluateAnswer(req: AnswerEvaluationRequest): AnswerEvaluation {
    const text = req.userAnswer.trim();
    const textLower = text.toLowerCase();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Check if user essentially skipped
    if (wordCount < 6 || textLower.includes('skip') || textLower.includes('don\'t know') || textLower.includes('no idea')) {
      return {
        overallScore: 2.0,
        dimensions: {
          technicalAccuracy: 2.0,
          relevance: 3.0,
          completeness: 1.5,
          clarity: 4.0,
          problemSolving: 1.5,
          communication: 3.5,
        },
        whatDidWell: ['Acknowledged knowledge boundaries transparently.'],
        whatToImprove: [
          'Review the core technical concepts of ' + (req.subtopic || req.category || 'this topic') + '.',
          'Practice structuring a partial response even when unsure of the full solution.'
        ],
        missingConcepts: [req.subtopic || 'Fundamental engineering concepts', 'Trade-off analysis'],
        specificCorrections: ['Skipped question yielded minimal assessment data.'],
        idealAnswer: req.question ? `An ideal answer covers the core definition, architecture, time/space complexity, and practical trade-offs.` : '',
        nextDifficultySuggestion: 'Easy',
        topicTag: req.subtopic || req.category || 'General CS',
        shouldAskFollowUp: false,
      };
    }

    // Technical term catalog
    const domainTerms = [
      'time complexity', 'space complexity', 'o(1)', 'o(n)', 'o(log n)', 'o(n^2)', 'big-o',
      'hash map', 'hash table', 'array', 'binary search', 'index', 'b-tree', 'b+ tree',
      'mutex', 'semaphore', 'lock', 'atomic', 'thread', 'process', 'race condition', 'concurrency',
      'dense_rank', 'row_number', 'partition by', 'foreign key', 'transaction', 'acid', 'isolation',
      'virtual dom', 'reconciliation', 'memo', 'usecallback', 'usememo', 're-render', 'virtualization',
      'dns', 'ip address', 'tcp', 'udp', 'http', 'latency', 'caching', 'redis', 'pool', 'connection',
      'trade-off', 'bottleneck', 'profiler', 'star', 'situation', 'task', 'action', 'result',
      'edge case', 'null', 'duplicate', 'rollback', 'idempotency', 'idempotent'
    ];

    let matchedTerms = 0;
    const termMatches: string[] = [];
    domainTerms.forEach(term => {
      if (textLower.includes(term)) {
        matchedTerms++;
        termMatches.push(term);
      }
    });

    // Check for logical and analytical connectors
    const analyticalKeywords = ['because', 'for example', 'trade-off', 'specifically', 'first', 'second', 'alternatively', 'in order to', 'mitigate', 'prevent'];
    let analyticalCount = 0;
    analyticalKeywords.forEach(kw => {
      if (textLower.includes(kw)) analyticalCount++;
    });

    // Calculate dimensions:
    // Technical Accuracy: Heavily driven by domain terminology and precision
    let technicalAccuracy = 6.0;
    if (matchedTerms >= 4) technicalAccuracy += 2.5;
    else if (matchedTerms >= 2) technicalAccuracy += 1.5;
    else if (matchedTerms === 0) technicalAccuracy -= 2.0;

    // Relevance: Address the prompt directly
    let relevance = 7.0;
    if (matchedTerms >= 1) relevance += 1.5;
    if (analyticalCount >= 2) relevance += 1.0;

    // Completeness: mentions edge cases or trade-offs
    let completeness = 5.5;
    if (textLower.includes('edge case') || textLower.includes('duplicate') || textLower.includes('null') || textLower.includes('trade-off')) {
      completeness += 2.5;
    }
    if (wordCount >= 35 && matchedTerms >= 2) completeness += 1.5;

    // Clarity: Organized thought process
    let clarity = 6.5;
    if (text.includes('\n') || text.includes('1.') || text.includes('- ') || analyticalCount >= 2) {
      clarity += 2.0;
    }

    // Problem Solving: Step-by-step reasoning
    let problemSolving = 6.0;
    if (analyticalCount >= 3) problemSolving += 2.5;
    else if (analyticalCount >= 1) problemSolving += 1.5;
    if (textLower.includes('optimize') || textLower.includes('complexity') || textLower.includes('approach')) {
      problemSolving += 1.0;
    }

    // Communication: Professional expression
    let communication = 7.0;
    if (analyticalCount >= 2) communication += 1.5;
    if (wordCount < 15) communication -= 1.5;

    // Clamp each dimension to [1.0, 10.0]
    const clamp = (val: number) => Number(Math.min(10.0, Math.max(1.0, val)).toFixed(1));
    const dims = {
      technicalAccuracy: clamp(technicalAccuracy),
      relevance: clamp(relevance),
      completeness: clamp(completeness),
      clarity: clamp(clarity),
      problemSolving: clamp(problemSolving),
      communication: clamp(communication),
    };

    // Weighted Overall Score based on interview type
    const isBehavioral = req.interviewType === 'Behavioral' || req.interviewType === 'HR';
    let overallScore: number;
    if (isBehavioral) {
      overallScore = Number((
        dims.relevance * 0.25 +
        dims.communication * 0.25 +
        dims.clarity * 0.20 +
        dims.problemSolving * 0.15 +
        dims.completeness * 0.15
      ).toFixed(1));
    } else {
      overallScore = Number((
        dims.technicalAccuracy * 0.30 +
        dims.problemSolving * 0.25 +
        dims.completeness * 0.15 +
        dims.relevance * 0.15 +
        dims.clarity * 0.10 +
        dims.communication * 0.05
      ).toFixed(1));
    }

    // Next difficulty suggestion
    let nextDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (overallScore >= 8.0) nextDifficulty = 'Hard';
    else if (overallScore < 5.0) nextDifficulty = 'Easy';

    // Tailored strengths and improvements
    const whatDidWell: string[] = [];
    const whatToImprove: string[] = [];
    const missingConcepts: string[] = [];
    const specificCorrections: string[] = [];

    if (matchedTerms >= 2) {
      whatDidWell.push(`Demonstrated solid technical domain grasp using key terms: ${termMatches.slice(0, 3).join(', ')}.`);
    } else {
      whatToImprove.push(`Incorporate more explicit technical terminology and precision rather than generic descriptions.`);
      missingConcepts.push(`Exact mechanical terminology for ${req.subtopic || 'this topic'}`);
    }

    if (analyticalCount >= 2) {
      whatDidWell.push('Articulated logical reasoning and trade-offs systematically.');
    } else {
      whatToImprove.push('Explain the "why" behind your solution: explicitly compare trade-offs or alternative options.');
    }

    if (completeness < 7.0) {
      whatToImprove.push('Proactively cover edge cases (e.g. empty inputs, duplicate entries, network timeouts).');
      missingConcepts.push('Edge-case and failure-mode analysis');
    } else {
      whatDidWell.push('Thoughtfully considered edge cases and boundary conditions.');
    }

    // Find ideal answer from bank if matched
    const bankItem = REALISTIC_QUESTION_BANK.find(q => q.question === req.question || q.subtopic === req.subtopic);
    const idealAnswer = bankItem?.idealAnswer ||
      `A model response directly defines the core concept, outlines memory or architectural trade-offs, mentions time/space complexity where applicable, and illustrates with a practical industry example.`;

    return {
      overallScore,
      dimensions: dims,
      whatDidWell: whatDidWell.length > 0 ? whatDidWell : ['Provided a logical baseline answer to the prompt.'],
      whatToImprove: whatToImprove.length > 0 ? whatToImprove : ['Continue practicing deep-dive trade-off discussions.'],
      missingConcepts,
      specificCorrections: specificCorrections.length > 0 ? specificCorrections : [],
      idealAnswer,
      nextDifficultySuggestion: nextDifficulty,
      topicTag: req.subtopic || req.category || 'Core Computer Science',
      shouldAskFollowUp: overallScore >= 6.5,
      followUpGoal: 'Probe deeper into edge cases, scalability bottlenecks, and verification methods.',
    };
  }

  /**
   * Synthesizes a realistic final report from actual question evaluations.
   */
  static generateFinalReport(req: FinalReportRequest): FinalReportResult {
    let sumAcc = 0, sumRel = 0, sumComp = 0, sumClar = 0, sumProb = 0, sumComm = 0;
    const count = Math.max(1, req.questions.length);

    const categoryScores: Record<string, { total: number; count: number }> = {};

    req.questions.forEach(q => {
      const d = q.evaluation.dimensions;
      sumAcc += d.technicalAccuracy;
      sumRel += d.relevance;
      sumComp += d.completeness;
      sumClar += d.clarity;
      sumProb += d.problemSolving;
      sumComm += d.communication;

      const cat = q.category || q.subtopic || 'Core Engineering';
      if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 };
      categoryScores[cat].total += q.score;
      categoryScores[cat].count += 1;
    });

    const avgAcc = (sumAcc / count) * 10;
    const avgRel = (sumRel / count) * 10;
    const avgComp = (sumComp / count) * 10;
    const avgClar = (sumClar / count) * 10;
    const avgProb = (sumProb / count) * 10;
    const avgComm = (sumComm / count) * 10;

    const overallPercentage = Math.round((avgAcc * 0.3 + avgProb * 0.25 + avgComp * 0.15 + avgRel * 0.15 + avgClar * 0.1 + avgComm * 0.05));

    // Detect weak topics where average score was < 7.0
    const weakTopics: string[] = [];
    Object.entries(categoryScores).forEach(([cat, val]) => {
      const avg = val.total / val.count;
      if (avg < 7.0) {
        weakTopics.push(cat);
      }
    });

    if (weakTopics.length === 0) {
      weakTopics.push('Data Structures & Algorithms', 'System Architecture');
    }

    const strengths: string[] = [];
    const areasToImprove: string[] = [];

    if (avgAcc >= 75) strengths.push('Strong technical domain accuracy and core concepts.');
    else areasToImprove.push('Deepen fundamental technical precision on core subject topics.');

    if (avgRel >= 75) strengths.push('Direct focus and high relevance in answers.');
    else areasToImprove.push('Ensure answers address the prompt directly without wandering off-topic.');

    if (avgProb >= 75) strengths.push('Structured analytical problem-solving and trade-off awareness.');
    else areasToImprove.push('Break down complex engineering scenarios systematically with trade-off analysis.');

    if (avgComm >= 75) strengths.push('Professional, structured communication and clear technical syntax.');

    const aiRecommendation = overallPercentage >= 80
      ? `Outstanding performance! You demonstrated genuine depth across ${req.jobRole} competencies. Continue practicing edge cases and large-scale distributed trade-offs to target top-tier tech offers.`
      : overallPercentage >= 65
      ? `Solid interview performance! You communicated clearly and demonstrated good fundamental knowledge. Focus your targeted drills on ${weakTopics.join(', ')} to boost your confidence and depth.`
      : `Good effort! You established a foundation, but showed noticeable gaps in ${weakTopics.join(', ')}. Dedicate practice sessions to step-by-step scenario breakdowns and concrete coding implementations.`;

    const suggestedPracticeQuestions = [
      {
        id: '1',
        topic: weakTopics[0] || 'DBMS',
        question: `How do B+ Tree index depth and fan-out minimize disk I/O in high-volume database queries?`,
        difficulty: 'Medium',
      },
      {
        id: '2',
        topic: weakTopics[1] || 'Operating Systems',
        question: `Explain how a CPU race condition causes lost updates in concurrent bank balance deposits and compare mutexes with atomic operations.`,
        difficulty: 'Medium',
      },
      {
        id: '3',
        topic: 'Data Structures',
        question: `Given an array of integers and a target sum, compare the O(N^2) brute-force approach with an O(N) hash-map solution.`,
        difficulty: 'Easy',
      },
    ];

    return {
      overallPercentage,
      skillScores: {
        technicalKnowledge: Math.round(avgAcc),
        communication: Math.round(avgComm),
        problemSolving: Math.round(avgProb),
        answerRelevance: Math.round(avgRel),
        confidence: Math.round((avgClar + avgComm) / 2),
      },
      strengths,
      areasToImprove,
      aiRecommendation,
      weakTopics,
      suggestedPracticeQuestions,
    };
  }

  static analyzeResume(req: ResumeAnalysisRequest): ResumeAnalysisResult {
    const text = req.resumeText.toLowerCase();

    const techCatalog = [
      'python', 'java', 'javascript', 'typescript', 'react', 'next.js',
      'node.js', 'sql', 'postgresql', 'mongodb', 'docker', 'aws',
      'git', 'c++', 'html', 'css', 'tailwind', 'graphql', 'redis'
    ];

    const extractedSkills = techCatalog.filter(skill => text.includes(skill)).map(s => s.toUpperCase());

    const hasEducation = text.includes('degree') || text.includes('bachelor') || text.includes('university') || text.includes('college') || text.includes('b.tech') || text.includes('b.e');
    const hasProjects = text.includes('project') || text.includes('github') || text.includes('built') || text.includes('developed');
    const hasExperience = text.includes('experience') || text.includes('intern') || text.includes('developer') || text.includes('engineer');

    let resumeScore = 65;
    if (extractedSkills.length >= 4) resumeScore += 15;
    if (hasEducation) resumeScore += 10;
    if (hasProjects) resumeScore += 5;
    if (hasExperience) resumeScore += 5;

    resumeScore = Math.min(98, resumeScore);

    const targetKeywords = req.jobDescription
      ? techCatalog.filter(s => req.jobDescription!.toLowerCase().includes(s)).map(s => s.toUpperCase())
      : ['REACT', 'SQL', 'NODE.JS', 'PYTHON', 'DOCKER'];

    const matchingSkills = extractedSkills.filter(s => targetKeywords.includes(s));
    const missingSkills = targetKeywords.filter(s => !extractedSkills.includes(s));

    return {
      resumeScore,
      matchPercentage: Math.round((matchingSkills.length / Math.max(1, targetKeywords.length)) * 100),
      extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['JAVASCRIPT', 'REACT', 'SQL', 'PYTHON'],
      education: hasEducation ? ['B.Tech / Bachelor of Science in Computer Science'] : ['Higher Education / Computer Science Coursework'],
      experienceHighlights: hasExperience ? ['Software Development Intern / Project Lead', 'Built full-stack web solutions'] : ['Academic Projects & Practical Coding Experience'],
      projects: hasProjects ? ['Full Stack Web Application', 'AI Interview Coach Simulation Platform'] : ['Portfolio Website', 'Data Processing Pipeline'],
      matchingSkills: matchingSkills.length > 0 ? matchingSkills : ['REACT', 'SQL'],
      missingSkills: missingSkills.length > 0 ? missingSkills : ['DOCKER', 'KUBERNETES', 'AWS'],
      feedbackSummary: `Extracted ${extractedSkills.length} core technical skills. Resume shows good project foundations. Adding quantified metrics and missing skills like ${missingSkills.slice(0, 2).join(', ')} will boost ATS screening.`,
      suggestedQuestions: [
        `You listed ${extractedSkills[0] || 'React'} on your resume. How do you handle complex state updates and avoid unnecessary component re-renders?`,
        `Describe the architecture of the project where you used ${extractedSkills[1] || 'SQL'}. How did you design database indexes for optimal query speed?`,
        `How would you integrate containerization with ${missingSkills[0] || 'Docker'} into your deployment workflow?`,
      ],
    };
  }

  static generatePracticeQuestions(req: PracticeQuestionsRequest): Array<{ id: string; question: string; difficulty: string; topic: string }> {
    // Check if we have matching curated questions from the bank
    const matched = REALISTIC_QUESTION_BANK.filter(q => q.topic.toLowerCase().includes(req.topic.toLowerCase()) || q.subtopic.toLowerCase().includes(req.topic.toLowerCase()));

    if (matched.length > 0) {
      return matched.slice(0, req.count).map(m => ({
        id: m.id,
        question: m.question,
        difficulty: m.difficulty,
        topic: m.topic,
      }));
    }

    const list = [
      { id: '1', question: `Explain how indexing works in ${req.topic} and how B-Trees optimize disk I/O.`, difficulty: req.difficulty, topic: req.topic },
      { id: '2', question: `What are the key trade-offs between speed, memory usage, and implementation complexity in ${req.topic}?`, difficulty: req.difficulty, topic: req.topic },
      { id: '3', question: `Describe a real-world production incident caused by misconfiguring ${req.topic} and how to fix it.`, difficulty: req.difficulty, topic: req.topic },
      { id: '4', question: `How does concurrency or multithreading affect ${req.topic} operations?`, difficulty: req.difficulty, topic: req.topic },
      { id: '5', question: `What design pattern or architectural principle is best applied when working with ${req.topic}?`, difficulty: req.difficulty, topic: req.topic },
    ];
    return list.slice(0, req.count);
  }
}
