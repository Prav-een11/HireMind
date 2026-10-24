export type CodingCategory =
  | 'Arrays & Strings'
  | 'Linked Lists'
  | 'Stacks & Queues'
  | 'Trees & Graphs'
  | 'Searching & Sorting'
  | 'Dynamic Programming & Backtracking'
  | 'Hashing & Data Structures'
  | 'SQL Interview Challenges'
  | 'Practical Programming';

export type CodingLanguage = 'python' | 'javascript' | 'java' | 'cpp';

export interface TestCase {
  id: number;
  input: string; // Displayed input or argument description
  args: any[];   // Raw arguments for execution runner
  expectedOutput: any; // Raw expected output
  expectedOutputDisplay: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: CodingCategory;
  tags: string[];
  statement: string;
  inputRequirements: string;
  outputRequirements: string;
  constraints: string[];
  edgeCases: string[];
  timeComplexityExpected: string;
  spaceComplexityExpected: string;
  examples: Array<{
    exampleNum: number;
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterTemplates: Record<CodingLanguage, string>;
  testCases: TestCase[];
  hints: string[];
  solutionExplanation: string;
  entryFunctionName: string; // e.g. 'twoSum', 'lengthOfLongestSubstring'
}

export interface ExecutionTestCaseResult {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtimeMs: number;
  isHidden?: boolean;
  error?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  executionEngine: 'Isolated JS Sandbox' | 'Isolated Python Process' | 'Static Analysis / Simulated Mode';
  isSimulated: boolean;
  totalTests: number;
  passedTests: number;
  testCases: ExecutionTestCaseResult[];
  timeComplexity: string;
  spaceComplexity: string;
  executionTimeMs: number;
  memoryMb: number;
  stdout?: string;
  error?: string;
}

