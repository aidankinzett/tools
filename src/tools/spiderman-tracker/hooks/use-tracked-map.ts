import { useState, useEffect, useCallback } from 'react'

interface UseTrackedMapReturn {
  data: Record<string, boolean>
  loaded: boolean
  saving: boolean
  toggle: (id: string) => void
  reset: () => void
  setAll: (data: Record<string, boolean>) => void
}

export function useTrackedMap(storageKey: string): UseTrackedMapReturn {
  const [data, setData] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) setData(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [storageKey])

  const save = useCallback((next: Record<string, boolean>) => {
    setSaving(true)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
    setTimeout(() => setSaving(false), 400)
  }, [storageKey])

  const toggle = useCallback((id: string) => {
    setData((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) delete next[id]
      save(next)
      return next
    })
  }, [save])

  const reset = useCallback(() => {
    if (confirm("Reset all progress? This cannot be undone.")) {
      setData({})
      save({})
    }
  }, [save])

  const setAll = useCallback((newData: Record<string, boolean>) => {
    setData(newData)
    save(newData)
  }, [save])

  return { data, loaded, saving, toggle, reset, setAll }
}
