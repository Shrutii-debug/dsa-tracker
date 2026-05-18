const PatternBadge = ({ pattern, size = 'sm' }) => {
  return (
    <span className={`badge badge-pattern ${size === 'lg' ? 'text-sm px-3 py-1' : ''}`}>
      {pattern}
    </span>
  )
}

export default PatternBadge