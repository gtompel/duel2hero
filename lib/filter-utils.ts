// Utility functions for filtering protocols

import type { Protocol } from "./types"
import type { FilterOptions } from "@/components/protocols-filter"

export function filterProtocols(protocols: Protocol[], filters: FilterOptions): Protocol[] {
  return protocols.filter((protocol) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const matchesTestType = protocol.testType.toLowerCase().includes(query)
      const matchesLevel = protocol.level.toLowerCase().includes(query)
      const matchesSportTitle = protocol.sportTitle?.toLowerCase().includes(query)

      if (!matchesTestType && !matchesLevel && !matchesSportTitle) {
        return false
      }
    }

    if (filters.dateFromDay && filters.dateFromMonth && filters.dateFromYear) {
      const fromDay = Number.parseInt(filters.dateFromDay)
      const fromMonth = Number.parseInt(filters.dateFromMonth)
      const fromYear = Number.parseInt(filters.dateFromYear)

      if (fromDay > 0 && fromMonth > 0 && fromYear > 0) {
        const protocolDate = new Date(protocol.dateYear, protocol.dateMonth - 1, protocol.dateDay)
        const fromDate = new Date(fromYear, fromMonth - 1, fromDay)
        if (protocolDate < fromDate) {
          return false
        }
      }
    }

    if (filters.dateToDay && filters.dateToMonth && filters.dateToYear) {
      const toDay = Number.parseInt(filters.dateToDay)
      const toMonth = Number.parseInt(filters.dateToMonth)
      const toYear = Number.parseInt(filters.dateToYear)

      if (toDay > 0 && toMonth > 0 && toYear > 0) {
        const protocolDate = new Date(protocol.dateYear, protocol.dateMonth - 1, protocol.dateDay)
        const toDate = new Date(toYear, toMonth - 1, toDay)
        if (protocolDate > toDate) {
          return false
        }
      }
    }

    if (filters.testType && filters.testType !== "all") {
      if (protocol.testType !== filters.testType) {
        return false
      }
    }

    if (filters.level && filters.level !== "all") {
      if (protocol.level !== filters.level) {
        return false
      }
    }

    return true
  })
}

export function sortProtocols(protocols: Protocol[], sortBy: "date" | "testType" | "level"): Protocol[] {
  const sorted = [...protocols]

  switch (sortBy) {
    case "date":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.dateYear, a.dateMonth - 1, a.dateDay)
        const dateB = new Date(b.dateYear, b.dateMonth - 1, b.dateDay)
        return dateB.getTime() - dateA.getTime()
      })
    case "testType":
      return sorted.sort((a, b) => a.testType.localeCompare(b.testType, "ru"))
    case "level":
      return sorted.sort((a, b) => {
        const levelOrder = { gold: 3, silver: 2, bronze: 1 }
        return (
          (levelOrder[b.level as keyof typeof levelOrder] || 0) - (levelOrder[a.level as keyof typeof levelOrder] || 0)
        )
      })
    default:
      return sorted
  }
}
