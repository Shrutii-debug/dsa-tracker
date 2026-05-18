import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { SECTION_ICONS } from '../utils/parseBreakdown'

const SectionCollapse = ({ title, content, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const icon = SECTION_ICONS[title] || '📄'

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
      >
        <span className="flex items-center gap-2 font-medium text-gray-200">
          <span>{icon}</span>
          <span>{title}</span>
        </span>
        <div className="flex items-center gap-2">
          {open && (
            <button
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-sky-400 transition-colors px-2 py-1 rounded"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
          <span className="text-gray-500 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="px-4 py-4 bg-gray-950 border-t border-gray-800">
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionCollapse