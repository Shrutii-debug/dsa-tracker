import SectionCollapse from './Sectioncollapse'
import { SECTION_ORDER } from '../utils/parseBreakdown'

const BreakdownCard = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No breakdown generated yet.
      </div>
    )
  }

  // Map section titles to content
  const sectionMap = {}
  breakdown.forEach((s) => { sectionMap[s.title] = s.content })

  const handleExportMarkdown = () => {
    const md = breakdown
      .map((s) => `## ${s.title}\n\n${s.content}`)
      .join('\n\n---\n\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'breakdown.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Sidebar navigation + export */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{breakdown.length} sections</p>
        <button onClick={handleExportMarkdown} className="btn-secondary text-xs py-1.5 px-3">
          ↓ Export as Markdown
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {SECTION_ORDER.map((title, idx) =>
          sectionMap[title] ? (
            <SectionCollapse
              key={title}
              title={title}
              content={sectionMap[title]}
              defaultOpen={idx === 0} // Core Concept open by default
            />
          ) : null
        )}
      </div>
    </div>
  )
}

export default BreakdownCard