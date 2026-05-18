import { useState, useEffect, useRef } from 'react'
import { problemService } from '../services/problemService'

const useProblems = (initialFilters = {}) => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const filtersRef = useRef(filters)

  // Keep ref in sync so we can use it inside effect without it being a dependency
  filtersRef.current = filters

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {}
        const f = filtersRef.current
        if (f.pattern) params.pattern = f.pattern
        if (f.difficulty) params.difficulty = f.difficulty
        if (f.status) params.status = f.status
        if (f.search) params.search = f.search
        const { data } = await problemService.getAll(params)
        if (!cancelled) setProblems(data.problems)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load problems')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [filters]) // eslint-disable-line

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === prev[key] ? '' : value }))
  }

  return { problems, loading, error, filters, updateFilter }
}

export default useProblems