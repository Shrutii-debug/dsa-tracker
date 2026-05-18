import { useState } from 'react'
import { aiService } from '../services/problemService'
import { useNavigate } from 'react-router-dom'

const useBreakdown = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const generate = async ({ originalStatement, language, platform, platformLink }) => {
    if (!originalStatement?.trim()) {
      setError('Please paste a problem statement')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await aiService.quickGenerate({
        originalStatement, language, platform, platformLink,
      })
      navigate(`/problems/${data.problem._id}`)
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Gemini API quota exceeded (1500/day free limit). Try again tomorrow.')
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, setError }
}

export default useBreakdown