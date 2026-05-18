// Parse the 14-section breakdown from the API response into a usable map
export const parseSections = (breakdown = []) => {
  const map = {}
  breakdown.forEach((section) => {
    map[section.title] = section.content
  })
  return map
}

// All 14 section names in display order
export const SECTION_ORDER = [
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

// Section icons for visual polish
export const SECTION_ICONS = {
  'Core Concept': '🎯',
  'Related Concepts': '🔗',
  'All Approaches': '🗺️',
  'Why Each Approach Fails': '❌',
  'Optimal Algorithm': '⚡',
  'Code': '💻',
  'Complexity Analysis': '📊',
  'Edge Cases': '⚠️',
  'Patterns Involved': '🧩',
  'Related Concepts You Must Know': '📚',
  'Variants': '🔀',
  'Common Mistakes and Interview Traps': '🪤',
  'Practice Questions': '📝',
  'Summary Notes': '📌',
}

// Format next review date for display
export const formatNextReview = (date) => {
  if (!date) return 'Not scheduled'
  const d = new Date(date)
  const now = new Date()
  const diffMs = d - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Due now'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
  return `In ${Math.ceil(diffDays / 30)} months`
}

// Difficulty color mapping
export const difficultyClass = (difficulty) => {
  return {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  }[difficulty] || 'badge'
}