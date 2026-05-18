export const PATTERNS = [
  'Array',
  'String',
  'Two Pointers',
  'Sliding Window',
  'Prefix Sum',
  'Hash Map / Hash Set',
  'Binary Search',
  'Sorting',
  'Recursion',
  'Dynamic Programming',
  'Greedy',
  'Stack',
  'Queue / Deque',
  'Linked List',
  'Tree',
  'Binary Search Tree',
  'Graph',
  'BFS',
  'DFS',
  'Backtracking',
  'Heap / Priority Queue',
  'Trie',
  'Union Find',
  'Bit Manipulation',
  'Math',
  'Matrix',
  'Monotonic Stack',
  'Divide and Conquer',
  'Other',
]

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
export const PLATFORMS = ['LeetCode', 'GFG', 'Codeforces', 'HackerRank', 'Custom', 'Other']
export const STATUS = ['Unsolved', 'Attempted', 'Solved']
export const REVIEW_STATUS = ['Understood', 'Shaky', 'Need to redo']

export const REVIEW_INTERVALS = {
  Understood: [1, 3, 7, 14, 30, 60],
  Shaky: [1, 2, 4, 7, 14],
  'Need to redo': [0, 1, 2, 3],
}