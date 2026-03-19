import { useState, useCallback } from 'react'
import { mockPlatforms, mockLogs, Platform, AccessLog } from '@/lib/mock-data'

// A simple global state hook for this MVP
// In a real app, you might use Zustand or Redux
let globalSearchQuery = ''
let listeners: Array<(query: string) => void> = []

export const useAppStore = () => {
  const [searchQuery, setLocalSearchQuery] = useState(globalSearchQuery)
  const [platforms] = useState<Platform[]>(mockPlatforms)
  const [logs] = useState<AccessLog[]>(mockLogs)

  const setSearchQuery = useCallback((query: string) => {
    globalSearchQuery = query
    setLocalSearchQuery(query)
    listeners.forEach((listener) => listener(query))
  }, [])

  // Subscribe to external changes
  useState(() => {
    const listener = (newQuery: string) => setLocalSearchQuery(newQuery)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  })

  const filteredPlatforms = platforms.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return {
    searchQuery,
    setSearchQuery,
    platforms: filteredPlatforms,
    allPlatforms: platforms,
    logs,
  }
}
