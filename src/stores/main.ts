import { useState, useCallback, useEffect } from 'react'
import { mockPlatforms, mockLogs, Platform, AccessLog } from '@/lib/mock-data'

let globalSearchQuery = ''
let globalPlatforms = [...mockPlatforms]
let globalLogs = [...mockLogs]
let listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export const useAppStore = () => {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick((t) => t + 1)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    globalSearchQuery = query
    notifyListeners()
  }, [])

  const addPlatform = useCallback((platform: Platform) => {
    globalPlatforms = [platform, ...globalPlatforms]
    notifyListeners()
  }, [])

  const filteredPlatforms = globalPlatforms.filter(
    (p) =>
      p.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(globalSearchQuery.toLowerCase()),
  )

  return {
    searchQuery: globalSearchQuery,
    setSearchQuery,
    platforms: filteredPlatforms,
    allPlatforms: globalPlatforms,
    logs: globalLogs,
    addPlatform,
  }
}
