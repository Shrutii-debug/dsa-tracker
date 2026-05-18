// Same file, same exports, same env var name — only the API call changed to Groq

const buildPrompt = (problemStatement, language) => {
  return `You are an expert DSA tutor. Analyze the following problem and provide a complete, structured breakdown.

PROBLEM:
${problemStatement}

PREFERRED LANGUAGE: ${language}

Respond in exactly this format with these 14 section headers (use === before and after each header):

===Core Concept===
What is the problem actually asking. Reframe it in the simplest possible terms. Identify the family it belongs to.

===Related Concepts===
Every concept touched by this problem — prefix sum, two pointers, DP, greedy, etc. Explained from scratch.

===All Approaches===
Every approach from brute force to optimal. For each: the idea, why it works/fails, time complexity, space complexity.

===Why Each Approach Fails===
Actually explain why you move from one approach to the next. The intuition jump.

===Optimal Algorithm===
Full dry run on a concrete example. Every variable tracked, every decision explained step by step.

===Code===
${language} code for the optimal solution. Clean, well-commented.

===Complexity Analysis===
Time and space for every approach with reasoning — not just O(n) but WHY it's O(n).

===Edge Cases===
Every tricky input that can break a solution. What happens and how the optimal handles it.

===Patterns Involved===
Every pattern this problem touches. How to recognize this pattern in future unseen problems.

===Related Concepts You Must Know===
Anything in the same family. Nothing gets left out.

===Variants===
Twisted versions of the same problem. Same core idea, different constraints. Give 3-5 examples.

===Common Mistakes and Interview Traps===
What interviewers specifically test. The traps in examples, edge cases they probe.

===Practice Questions===
LeetCode/GFG problems for every concept discussed. Format each as: [Problem Name] - [Platform] - [Difficulty] - [Link if known]

===Summary Notes===
Complete self-contained reference note. Everything compressed so you can revise from just this section.

Also, at the very end, add a JSON block in this exact format (I will parse this):
===META===
{
  "detectedPattern": "one of: Array, String, Two Pointers, Sliding Window, Prefix Sum, Hash Map / Hash Set, Binary Search, Sorting, Recursion, Dynamic Programming, Greedy, Stack, Queue / Deque, Linked List, Tree, Binary Search Tree, Graph, BFS, DFS, Backtracking, Heap / Priority Queue, Trie, Union Find, Bit Manipulation, Math, Matrix, Monotonic Stack, Divide and Conquer, Other",
  "secondaryPatterns": ["up to 2 secondary patterns from same list"],
  "difficulty": "Easy or Medium or Hard",
  "title": "short problem title (5 words max)",
  "tags": ["concept1", "concept2", "concept3"]
}`
}

const parseBreakdownResponse = (text) => {
  const sectionNames = [
    'Core Concept',
    'Related Concepts',
    'All Approaches',
    'Why Each Approach Fails',
    'Optimal Algorithm',
    'Code',
    'Complexity Analysis',
    'Edge Cases',
    'Patterns Involved',
    'Related Concepts You Must Know',
    'Variants',
    'Common Mistakes and Interview Traps',
    'Practice Questions',
    'Summary Notes',
  ]

  const sections = []
  const metaMatch = text.match(/===META===\s*([\s\S]*?)$/)
  let meta = null

  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1].trim())
    } catch (e) {
      console.error('Failed to parse META JSON:', e.message)
    }
    text = text.replace(/===META===[\s\S]*$/, '')
  }

  for (let i = 0; i < sectionNames.length; i++) {
    const currentHeader = `===${sectionNames[i]}===`
    const nextHeader = i + 1 < sectionNames.length ? `===${sectionNames[i + 1]}===` : null

    const start = text.indexOf(currentHeader)
    if (start === -1) continue

    const contentStart = start + currentHeader.length
    const end = nextHeader ? text.indexOf(nextHeader) : text.length

    const content = text.slice(contentStart, end !== -1 ? end : text.length).trim()

    sections.push({ title: sectionNames[i], content })
  }

  return { sections, meta }
}

export const generateBreakdown = async (problemStatement, language = 'Python') => {
  // Still reads GEMINI_API_KEY — no changes needed anywhere else in your project
  // Just put your Groq key as GEMINI_API_KEY=gsk_... in server/.env
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert DSA tutor. Follow the exact output format the user specifies. Do not add any text before or after the requested format.',
        },
        {
          role: 'user',
          content: buildPrompt(problemStatement, language),
        },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('Groq API error:', JSON.stringify(error, null, 2))

    if (response.status === 429) {
      throw new Error(`quota: Rate limit exceeded. ${error?.error?.message || ''}`)
    }
    throw new Error(`Groq API error: ${response.status} ${error?.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content

  if (!text) throw new Error('No text in Groq response')

  const { sections, meta } = parseBreakdownResponse(text)
  return { sections, meta, rawText: text }
}