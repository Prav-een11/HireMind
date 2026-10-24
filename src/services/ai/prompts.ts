export const AI_PROMPTS = {
  generateQuestion: (params: {
    jobRole: string;
    experienceLevel?: string;
    interviewType: string;
    difficulty: string;
    questionIndex: number;
    totalQuestions: number;
    weakTopics?: string[];
    previousQuestionIds?: string[];
    previousQuestionTopics?: string[];
    resumeContext?: string;
  }) => `
You are an expert technical interviewer and staff software engineer conducting a realistic ${params.difficulty} level ${params.interviewType} interview for the position of "${params.jobRole}" (Candidate Experience Level: ${params.experienceLevel || 'Fresher'}).
This is question ${params.questionIndex} of ${params.totalQuestions}.

CRITICAL GUIDELINES:
- DO NOT ask superficial 2-4 mark textbook trivia (e.g. "What is Python?", "Define OOP", "What is SQL?", "What is an operating system?").
- Align the question depth with the experience level:
  * Fresher: Focus on entry-level software engineering interviews—DSA implementation, core OS (concurrency/race conditions), DBMS (indexing, ACID, complex SQL), Networks (debugging connectivity, HTTP/DNS), OOP principles with practical trade-offs. Do NOT ask senior-level distributed system design.
  * 3-5 Years Experience: Focus on API architecture, database query optimization, connection pooling, caching strategies, concurrency, distributed system fundamentals, production debugging, and testing.
  * HR / Behavioral: Use the STAR method (Situation, Task, Action, Result) focused on technical disagreements, production failures, deadlines, and ownership.
  * Coding: Algorithmic reasoning, edge cases, time & space complexity expectations.
- Avoid repeating topics already covered: ${params.previousQuestionTopics?.join(', ') || 'None'}.
${params.weakTopics && params.weakTopics.length > 0 ? `- The candidate previously struggled with: ${params.weakTopics.join(', ')}. Target one of these topics if suitable.\n` : ''}
${params.resumeContext ? `- Candidate Resume Highlights:\n${params.resumeContext}\n` : ''}

Categories to draw from:
1. Conceptual understanding with practical application
2. Scenario-based problem solving
3. Debugging and root-cause analysis
4. Design and architecture decisions
5. Project-based technical discussions
6. Trade-off analysis
7. Coding and algorithmic reasoning
8. Behavioral questions using the STAR method
9. SQL and database problem solving

Respond ONLY with a valid JSON object matching this schema:
{
  "question": "The realistic, detailed question prompt...",
  "category": "e.g. Scenario-Based Problem Solving | Debugging & Root-Cause Analysis | SQL & Database Problem Solving",
  "subtopic": "e.g. B+ Tree Indexing | React Reconciliation | Race Conditions",
  "difficulty": "${params.difficulty}",
  "expectedCompetencies": ["Competency 1", "Competency 2", "Competency 3"],
  "evaluationRubric": {
    "technicalAccuracy": "What constitutes full technical correctness",
    "relevance": "How directly the response must address the question",
    "completeness": "Edge cases or trade-offs that must be touched on",
    "clarity": "Logical structure and explanation flow expected",
    "problemSolving": "Reasoning approach expected",
    "communication": "Tone and domain terminology expected"
  },
  "expectedDepth": "e.g. 1-2 minutes: structured step-by-step diagnostic breakdown with concrete tools",
  "constraints": ["Constraint 1", "Constraint 2"],
  "suggestedPoints": ["Key point 1 expected in good answer", "Key point 2", "Key point 3"],
  "idealAnswer": "A concise, comprehensive model answer demonstrating senior engineering clarity and depth...",
  "followUpObjectives": "Objective of follow-up question if candidate answers well"
}
`,

  generateFollowUp: (params: {
    jobRole: string;
    parentQuestion: string;
    candidateAnswer: string;
    answerScore: number;
    subtopic?: string;
  }) => `
You are an expert technical interviewer conducting an interactive interview for "${params.jobRole}".
The candidate just answered the following question:
Parent Question: "${params.parentQuestion}"
Candidate Answer: "${params.candidateAnswer}"
Evaluated Score: ${params.answerScore}/10

Generate a natural, adaptive FOLLOW-UP question that directly builds upon what the candidate said:
- If the candidate performed well (score >= 7.5): Probe deeper into edge cases, scalability bottlenecks, failure modes, or architectural trade-offs.
- If the candidate had gaps or misconceptions (score < 7.0): Clarify the misconception or ask how they would verify/debug their approach with concrete sample inputs.

Respond ONLY with a valid JSON object:
{
  "question": "The follow-up question text...",
  "category": "Follow-Up Probing",
  "subtopic": "${params.subtopic || 'Engineering Deep Dive'}",
  "difficulty": "${params.answerScore >= 7.5 ? 'Hard' : 'Medium'}",
  "expectedCompetencies": ["Edge case handling", "System trade-offs", "Root cause reasoning"],
  "expectedDepth": "45-90 seconds direct technical explanation",
  "idealAnswer": "A concise model answer to this follow-up...",
  "followUpObjectives": "Probing candidate's depth and engineering judgment"
}
`,

  evaluateAnswer: (params: {
    jobRole: string;
    experienceLevel?: string;
    interviewType: string;
    difficulty: string;
    question: string;
    userAnswer: string;
    category?: string;
    subtopic?: string;
  }) => `
You are an expert technical evaluator assessing a candidate's answer for the role of "${params.jobRole}" (Experience: ${params.experienceLevel || 'Fresher'}).

Interview Question: "${params.question}"
Category: ${params.category || 'General CS'}
Subtopic: ${params.subtopic || 'Software Engineering'}
Difficulty: ${params.difficulty}
Candidate's Answer: "${params.userAnswer}"

EVALUATION RULES:
1. Assess the response across six distinct dimensions (each scored 0.0 to 10.0):
   - technicalAccuracy: Precision, correctness of concepts, algorithms, mechanics.
   - relevance: How directly it addresses the prompt without dodging or rambling.
   - completeness: Covering necessary edge cases, performance implications, or failure modes.
   - clarity: Structured explanation, coherent logical progression.
   - problemSolving: Analytical thinking, trade-off awareness, systematic reasoning.
   - communication: Professional tone, domain terminology, confidence.
2. DO NOT reward length by itself. A concise, accurate response (e.g. 50 words that hit the exact mechanical truth) must score HIGHER than a 300-word vague or inaccurate answer.
3. Compute overallScore as the weighted average:
   - For Technical/Coding questions: Technical Accuracy (30%), Problem Solving (25%), Completeness (15%), Relevance (15%), Clarity (10%), Communication (5%).
   - For Behavioral questions: Relevance (25%), Communication (25%), Clarity (20%), Problem Solving (15%), Completeness (15%).
4. Determine nextDifficultySuggestion ('Easy', 'Medium', 'Hard'):
   - Score >= 8.0: 'Hard' or probe deeper.
   - Score 5.0 - 7.9: 'Medium' (maintain and test related competency).
   - Score < 5.0: 'Easy' (revisit foundational understanding).

Respond ONLY with a valid JSON object:
{
  "overallScore": 8.2,
  "dimensions": {
    "technicalAccuracy": 8.5,
    "relevance": 9.0,
    "completeness": 7.5,
    "clarity": 8.5,
    "problemSolving": 8.0,
    "communication": 8.0
  },
  "whatDidWell": [
    "Specific strength with exact concept demonstrated",
    "Another specific positive element"
  ],
  "whatToImprove": [
    "Constructive critique identifying missing nuance or edge case",
    "Specific actionable recommendation"
  ],
  "missingConcepts": [
    "Key concept 1 omitted",
    "Key concept 2 omitted"
  ],
  "specificCorrections": [
    "Any inaccurate assumption corrected"
  ],
  "idealAnswer": "Concise model answer demonstrating how a top engineer answers this question...",
  "nextDifficultySuggestion": "Medium",
  "topicTag": "${params.subtopic || params.category || 'Core Computer Science'}",
  "shouldAskFollowUp": true,
  "followUpGoal": "Probe trade-offs in concurrent environments"
}
`,

  finalReport: (params: {
    jobRole: string;
    interviewType: string;
    questionsSummary: string;
  }) => `
Synthesize a comprehensive final interview performance report for a candidate who completed a ${params.interviewType} interview for "${params.jobRole}".

Questions and evaluated answers summary:
${params.questionsSummary}

Analyze demonstrated competencies and weak topics accurately based on actual evaluation scores.
Respond ONLY with a valid JSON object:
{
  "overallPercentage": 82,
  "skillScores": {
    "technicalKnowledge": 85,
    "communication": 78,
    "problemSolving": 80,
    "answerRelevance": 88,
    "confidence": 76
  },
  "strengths": [
    "Strong technical accuracy in data structure selection and time complexity",
    "Clear, structured breakdown of system components"
  ],
  "areasToImprove": [
    "Elaborate more proactively on failure scenarios and edge cases",
    "Incorporate more precise database indexing mechanics"
  ],
  "aiRecommendation": "Personalized assessment of candidate readiness, specific areas to drill, and next interview milestones.",
  "weakTopics": ["DBMS", "Operating Systems"],
  "suggestedPracticeQuestions": [
    {
      "id": "1",
      "topic": "DBMS",
      "question": "Explain how B+ Tree indexing minimizes disk I/O compared to binary trees in relational databases.",
      "difficulty": "Medium"
    }
  ]
}
`,

  analyzeResume: (resumeText: string, jobDescription?: string) => `
Analyze the following resume for ATS optimization, skill extraction, and job alignment.

Resume Text:
${resumeText}

${jobDescription ? `Target Job Description:\n${jobDescription}\n` : ''}

Respond ONLY with a JSON object:
{
  "resumeScore": 82,
  "matchPercentage": ${jobDescription ? 85 : 90},
  "extractedSkills": ["Python", "JavaScript", "React", "Node.js", "SQL"],
  "education": ["B.Tech Computer Science"],
  "experienceHighlights": ["Built full stack web applications", "Worked with REST APIs"],
  "projects": ["HireMind Interview Platform", "E-commerce Engine"],
  "matchingSkills": ["Python", "SQL", "React"],
  "missingSkills": ["Docker", "Kubernetes", "AWS"],
  "feedbackSummary": "Strong technical background with solid project work. Consider highlighting cloud deployment and containerization skills.",
  "suggestedQuestions": [
    "How did you handle database query performance in your React/SQL project?",
    "Can you explain how state management works in your React application?"
  ]
}
`
};
