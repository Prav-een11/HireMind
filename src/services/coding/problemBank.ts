import { CodingProblem } from './types';

export const CODING_PROBLEMS: CodingProblem[] = [
  // ==========================================
  // 1. ARRAYS & STRINGS
  // ==========================================
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    tags: ['Array', 'Hash Table', 'FAANG Favorite'],
    statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    inputRequirements: 'nums: an array of integers; target: a target integer sum.',
    outputRequirements: 'An array of two integers representing 0-based indices [index1, index2].',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    edgeCases: [
      'Negative numbers in array (e.g. nums = [-3, 4, 3, 90], target = 0)',
      'Duplicate values that add up to target (e.g. nums = [3, 3], target = 6)',
      'Large values where integer overflow should be avoided'
    ],
    timeComplexityExpected: 'O(N) single-pass using hash map',
    spaceComplexityExpected: 'O(N) for hash map storage',
    examples: [
      {
        exampleNum: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        exampleNum: 2,
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        exampleNum: 3,
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
      }
    ],
    starterTemplates: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Optimize to O(N) time using a hash map
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
      javascript: `function twoSum(nums, target) {
    // Write your O(N) solution using a Map or object
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}
`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};
`
    },
    testCases: [
      { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', args: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], expectedOutputDisplay: '[0, 1]', isHidden: false },
      { id: 2, input: 'nums = [3, 2, 4], target = 6', args: [[3, 2, 4], 6], expectedOutput: [1, 2], expectedOutputDisplay: '[1, 2]', isHidden: false },
      { id: 3, input: 'nums = [3, 3], target = 6', args: [[3, 3], 6], expectedOutput: [0, 1], expectedOutputDisplay: '[0, 1]', isHidden: false },
      { id: 4, input: 'nums = [-1, -2, -3, -4, -5], target = -8', args: [[-1, -2, -3, -4, -5], -8], expectedOutput: [2, 4], expectedOutputDisplay: '[2, 4]', isHidden: true },
      { id: 5, input: 'nums = [1000000, 500, 2000000, 1500], target = 2000', args: [[1000000, 500, 2000000, 1500], 2000], expectedOutput: [1, 3], expectedOutputDisplay: '[1, 3]', isHidden: true }
    ],
    hints: [
      'A brute force approach checks all pairs in O(N^2) time. Can we do better?',
      'As you iterate through the array, what information do you need to know about elements you have already seen?',
      'Store each number and its index in a hash map. For each number, check if target - number is in the map.'
    ],
    solutionExplanation: 'By using a hash map to record elements seen so far, for each number we can query whether its complement (target - num) exists in O(1) time. This brings the time complexity down from O(N^2) to O(N), with O(N) space complexity.',
    entryFunctionName: 'twoSum'
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    statement: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    inputRequirements: 's: a string consisting of English letters, digits, symbols, and spaces.',
    outputRequirements: 'An integer representing the length of the longest non-repeating substring.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    edgeCases: [
      'Empty string "" -> return 0',
      'String with all identical characters "bbbbb" -> return 1',
      'String with whitespace and symbols "pwwkew abc" -> return valid length'
    ],
    timeComplexityExpected: 'O(N) with sliding window',
    spaceComplexityExpected: 'O(min(N, M)) where M is alphabet size',
    examples: [
      {
        exampleNum: 1,
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        exampleNum: 2,
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        exampleNum: 3,
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Notice that "pwke" is a subsequence and not a substring.'
      }
    ],
    starterTemplates: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Use sliding window with a hash map of character last seen index
    char_map = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len
`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Sliding window using last-seen character indices
    const lastSeen = new Map();
    let left = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
            left = lastSeen.get(ch) + 1;
        }
        lastSeen.set(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
`,
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> lastSeen = new HashMap<>();
        int left = 0;
        int maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {
                left = lastSeen.get(ch) + 1;
            }
            lastSeen.put(ch, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        std::unordered_map<char, int> lastSeen;
        int left = 0;
        int maxLen = 0;
        for (int right = 0; right < s.length(); ++right) {
            char ch = s[right];
            if (lastSeen.find(ch) != lastSeen.end() && lastSeen[ch] >= left) {
                left = lastSeen[ch] + 1;
            }
            lastSeen[ch] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};
`
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', args: ['abcabcbb'], expectedOutput: 3, expectedOutputDisplay: '3', isHidden: false },
      { id: 2, input: 's = "bbbbb"', args: ['bbbbb'], expectedOutput: 1, expectedOutputDisplay: '1', isHidden: false },
      { id: 3, input: 's = "pwwkew"', args: ['pwwkew'], expectedOutput: 3, expectedOutputDisplay: '3', isHidden: false },
      { id: 4, input: 's = ""', args: [''], expectedOutput: 0, expectedOutputDisplay: '0', isHidden: true },
      { id: 5, input: 's = "tmmzuxt"', args: ['tmmzuxt'], expectedOutput: 5, expectedOutputDisplay: '5', isHidden: true }
    ],
    hints: [
      'Maintain a sliding window [left, right] that contains unique characters.',
      'When you see a repeated character, jump the left pointer to the right of the previous occurrence.',
      'Track the last seen index of each character to achieve O(N) in a single pass.'
    ],
    solutionExplanation: 'We maintain two pointers defining a sliding window [left, right] of characters without duplicates. Storing the most recent index of each character in a map lets us move `left` to `lastSeen[ch] + 1` whenever a duplicate is found in the current window.',
    entryFunctionName: 'lengthOfLongestSubstring'
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    tags: ['Array', 'Sorting'],
    statement: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    inputRequirements: 'intervals: a 2D array of start and end pairs.',
    outputRequirements: 'A 2D array of merged non-overlapping interval pairs.',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    edgeCases: [
      'Single interval [ [1, 4] ] -> returns [ [1, 4] ]',
      'Completely contained interval [ [1, 5], [2, 3] ] -> returns [ [1, 5] ]',
      'Intervals touching at endpoint [ [1, 4], [4, 5] ] -> merged to [ [1, 5] ]'
    ],
    timeComplexityExpected: 'O(N log N) dominated by sorting',
    spaceComplexityExpected: 'O(N) for output array or sorting space',
    examples: [
      {
        exampleNum: 1,
        input: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]',
        output: '[[1, 6], [8, 10], [15, 18]]',
        explanation: 'Since intervals [1, 3] and [2, 6] overlap, merge them into [1, 6].'
      },
      {
        exampleNum: 2,
        input: 'intervals = [[1, 4], [4, 5]]',
        output: '[[1, 5]]',
        explanation: 'Intervals [1, 4] and [4, 5] are considered overlapping.'
      }
    ],
    starterTemplates: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        prev_start, prev_end = merged[-1]
        if start <= prev_end:
            merged[-1][1] = max(prev_end, end)
        else:
            merged.append([start, end])
    return merged
`,
      javascript: `function merge(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];
        const last = merged[merged.length - 1];
        if (start <= last[1]) {
            last[1] = Math.max(last[1], end);
        } else {
            merged.push([start, end]);
        }
    }
    return merged;
}
`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        int[] current = intervals[0];
        result.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]);
            } else {
                current = interval;
                result.add(current);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
        if (intervals.empty()) return {};
        std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
            return a[0] < b[0];
        });
        std::vector<std::vector<int>> merged;
        merged.push_back(intervals[0]);
        for (size_t i = 1; i < intervals.size(); ++i) {
            if (intervals[i][0] <= merged.back()[1]) {
                merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
            } else {
                merged.push_back(intervals[i]);
            }
        }
        return merged;
    }
};
`
    },
    testCases: [
      { id: 1, input: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]', args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expectedOutput: [[1, 6], [8, 10], [15, 18]], expectedOutputDisplay: '[[1, 6], [8, 10], [15, 18]]', isHidden: false },
      { id: 2, input: 'intervals = [[1, 4], [4, 5]]', args: [[[1, 4], [4, 5]]], expectedOutput: [[1, 5]], expectedOutputDisplay: '[[1, 5]]', isHidden: false },
      { id: 3, input: 'intervals = [[1, 4], [0, 4]]', args: [[[1, 4], [0, 4]]], expectedOutput: [[0, 4]], expectedOutputDisplay: '[[0, 4]]', isHidden: true }
    ],
    hints: [
      'Sort the intervals by their start time first.',
      'Once sorted, compare each interval with the last interval in your merged list.',
      'If interval.start <= last.end, they overlap, so update last.end = max(last.end, interval.end).'
    ],
    solutionExplanation: 'Sorting the intervals by their start value ensures that overlapping intervals are consecutive. In a single linear scan, we compare the current interval with the last interval added to the merged output.',
    entryFunctionName: 'merge'
  },

  // ==========================================
  // 2. STACKS & QUEUES
  // ==========================================
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    tags: ['Stack', 'String'],
    statement: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    inputRequirements: 's: a string consisting only of brackets.',
    outputRequirements: 'Boolean true if valid, false otherwise.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    edgeCases: [
      'Single character "(" or "]" -> return false',
      'Odd length string -> immediately false',
      'Interleaved invalid brackets "([)]" -> return false'
    ],
    timeComplexityExpected: 'O(N) single pass',
    spaceComplexityExpected: 'O(N) for stack',
    examples: [
      {
        exampleNum: 1,
        input: 's = "()"',
        output: 'true'
      },
      {
        exampleNum: 2,
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        exampleNum: 3,
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starterTemplates: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0
`,
      javascript: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (map[char]) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}
`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
      cpp: `#include <string>
#include <stack>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};
`
    },
    testCases: [
      { id: 1, input: 's = "()"', args: ['()'], expectedOutput: true, expectedOutputDisplay: 'true', isHidden: false },
      { id: 2, input: 's = "()[]{}"', args: ['()[]{}'], expectedOutput: true, expectedOutputDisplay: 'true', isHidden: false },
      { id: 3, input: 's = "(]"', args: ['(]'], expectedOutput: false, expectedOutputDisplay: 'false', isHidden: false },
      { id: 4, input: 's = "([)]"', args: ['([)]'], expectedOutput: false, expectedOutputDisplay: 'false', isHidden: true },
      { id: 5, input: 's = "{[]}"', args: ['{[]}'], expectedOutput: true, expectedOutputDisplay: 'true', isHidden: true }
    ],
    hints: [
      'A stack is the natural data structure because the last opened bracket must be the first one closed (LIFO).',
      'Push matching closing brackets as you see opening brackets.'
    ],
    solutionExplanation: 'Pushing onto a stack for opening brackets and popping to match when closing brackets are encountered ensures proper nesting in O(N) time.',
    entryFunctionName: 'isValid'
  },

  // ==========================================
  // 3. DYNAMIC PROGRAMMING & SEARCHING
  // ==========================================
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming & Backtracking',
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    statement: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
    inputRequirements: 'coins: array of positive integers; amount: target integer.',
    outputRequirements: 'Fewest integer coin count or -1 if impossible.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    edgeCases: [
      'amount == 0 -> return 0',
      'amount cannot be formed (e.g. coins = [2], amount = 3) -> return -1',
      'coins larger than amount -> skipped automatically'
    ],
    timeComplexityExpected: 'O(amount * len(coins))',
    spaceComplexityExpected: 'O(amount) for DP table',
    examples: [
      {
        exampleNum: 1,
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins)'
      },
      {
        exampleNum: 2,
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        exampleNum: 3,
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    starterTemplates: {
      python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
`,
      javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int i = coin; i <= amount; ++i) {
                dp[i] = std::min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
`
    },
    testCases: [
      { id: 1, input: 'coins = [1, 2, 5], amount = 11', args: [[1, 2, 5], 11], expectedOutput: 3, expectedOutputDisplay: '3', isHidden: false },
      { id: 2, input: 'coins = [2], amount = 3', args: [[2], 3], expectedOutput: -1, expectedOutputDisplay: '-1', isHidden: false },
      { id: 3, input: 'coins = [1], amount = 0', args: [[1], 0], expectedOutput: 0, expectedOutputDisplay: '0', isHidden: false },
      { id: 4, input: 'coins = [186, 419, 83, 408], amount = 6249', args: [[186, 419, 83, 408], 6249], expectedOutput: 20, expectedOutputDisplay: '20', isHidden: true }
    ],
    hints: [
      'Think bottom-up: what is the minimum coins to make 0? 1? 2? up to amount.',
      'dp[i] = min(dp[i], dp[i - coin] + 1).'
    ],
    solutionExplanation: 'Bottom-up dynamic programming builds an array `dp` of size `amount + 1` where `dp[i]` stores the minimum coins to make amount `i`. We iterate over each coin denomination and update reachable amounts.',
    entryFunctionName: 'coinChange'
  },

  // ==========================================
  // 4. PRACTICAL PROGRAMMING
  // ==========================================
  {
    id: 'api-pagination-filter',
    title: 'API Pagination and Filter Function',
    difficulty: 'Medium',
    category: 'Practical Programming',
    tags: ['Algorithms', 'Backend Engineering', 'Production Code'],
    statement: 'Implement an in-memory API pagination and filtering utility `paginateAndFilter(items, options)`. Given an array of data objects, a query filter object, a page number (1-based), and a page limit, return a structured pagination response: `{ data, page, limit, totalItems, totalPages }`.\n\nFiltering must match all specified key-value constraints. If page exceeds totalPages, `data` should be an empty list.',
    inputRequirements: 'items: list of objects; options: { filter?: object, page?: number, limit?: number }',
    outputRequirements: 'Object with { data: any[], page: number, limit: number, totalItems: number, totalPages: number }',
    constraints: [
      'page >= 1, limit >= 1',
      'Options may omit fields; defaults are page = 1, limit = 10, filter = {}'
    ],
    edgeCases: [
      'Empty dataset items = [] -> totalItems = 0, totalPages = 0, data = []',
      'Page number beyond totalPages -> data = []',
      'Filter with no matching records -> data = [], totalItems = 0'
    ],
    timeComplexityExpected: 'O(N) filtering and slice',
    spaceComplexityExpected: 'O(K) where K is filtered result size',
    examples: [
      {
        exampleNum: 1,
        input: 'items = [{id:1, role:"admin"}, {id:2, role:"user"}, {id:3, role:"admin"}], options = { filter: { role: "admin" }, page: 1, limit: 1 }',
        output: '{ data: [{id:1, role:"admin"}], page: 1, limit: 1, totalItems: 2, totalPages: 2 }'
      }
    ],
    starterTemplates: {
      python: `def paginateAndFilter(items: list[dict], options: dict = None) -> dict:
    if options is None:
        options = {}
    filter_spec = options.get("filter", {})
    page = max(1, options.get("page", 1))
    limit = max(1, options.get("limit", 10))

    # Apply filter constraints
    filtered = []
    for item in items:
        match = True
        for k, v in filter_spec.items():
            if item.get(k) != v:
                match = False
                break
        if match:
            filtered.append(item)

    total_items = len(filtered)
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 0

    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paged_data = filtered[start_idx:end_idx] if start_idx < total_items else []

    return {
        "data": paged_data,
        "page": page,
        "limit": limit,
        "totalItems": total_items,
        "totalPages": total_pages,
    }
`,
      javascript: `function paginateAndFilter(items, options = {}) {
    const filter = options.filter || {};
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);

    const filtered = items.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
            if (item[key] !== val) return false;
        }
        return true;
    });

    const totalItems = filtered.length;
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0;
    const startIdx = (page - 1) * limit;
    const data = startIdx < totalItems ? filtered.slice(startIdx, startIdx + limit) : [];

    return {
        data,
        page,
        limit,
        totalItems,
        totalPages
    };
}
`,
      java: `// Production implementation template
`,
      cpp: `// Production implementation template
`
    },
    testCases: [
      {
        id: 1,
        input: 'items: 3 items, filter: role="admin", page: 1, limit: 1',
        args: [
          [
            { id: 1, role: 'admin' },
            { id: 2, role: 'user' },
            { id: 3, role: 'admin' }
          ],
          { filter: { role: 'admin' }, page: 1, limit: 1 }
        ],
        expectedOutput: {
          data: [{ id: 1, role: 'admin' }],
          page: 1,
          limit: 1,
          totalItems: 2,
          totalPages: 2
        },
        expectedOutputDisplay: '{ data: [{id:1}], page: 1, limit: 1, totalItems: 2, totalPages: 2 }',
        isHidden: false
      },
      {
        id: 2,
        input: 'items: 2 items, page 5, limit 1 (out of bounds)',
        args: [
          [{ id: 1 }, { id: 2 }],
          { page: 5, limit: 1 }
        ],
        expectedOutput: {
          data: [],
          page: 5,
          limit: 1,
          totalItems: 2,
          totalPages: 2
        },
        expectedOutputDisplay: '{ data: [], page: 5, limit: 1, totalItems: 2, totalPages: 2 }',
        isHidden: false
      }
    ],
    hints: [
      'Filter records against all key-value pairs in options.filter.',
      'Compute totalPages using Math.ceil(totalItems / limit) or integer math.',
      'Safely slice the array using start index (page - 1) * limit.'
    ],
    solutionExplanation: 'Filtering uses a single pass over items checking key matching. Pagination then slices the resulting subset according to (page - 1) * limit.',
    entryFunctionName: 'paginateAndFilter'
  }
];

export class CodingProblemEngine {
  static getAllProblems(): CodingProblem[] {
    return CODING_PROBLEMS;
  }

  static getProblemById(id: string): CodingProblem | undefined {
    return CODING_PROBLEMS.find(p => p.id === id);
  }

  static getProblemsByCategory(category: string): CodingProblem[] {
    return CODING_PROBLEMS.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  static getProblemsByDifficulty(difficulty: string): CodingProblem[] {
    return CODING_PROBLEMS.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
}

