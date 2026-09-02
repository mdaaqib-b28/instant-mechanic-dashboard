import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Polls an async fetcher function on an interval and returns the latest data.
 * This is the "Basic" live-update tier: automatic API polling / refresh.
 */
export function usePolling(fetcher, deps = [], intervalMs = 15000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const result = await fetcher()
      setData(result)
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, intervalMs)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, intervalMs])

  return { data, error, loading, refetch: load }
}
