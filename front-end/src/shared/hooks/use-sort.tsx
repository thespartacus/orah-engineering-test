import { useState, useEffect, useCallback } from "react"
import { Person } from "shared/models/person"

type SortOrder = "asc" | "desc"

interface UseSortProps<SortData extends Person> {
  data: SortData[]
  sortByParam: keyof SortData
  sortOrderParam: SortOrder
}

export const useSort = <SortData extends Person>({ data = [], sortByParam, sortOrderParam }: UseSortProps<SortData>) => {
  const [sortedData, setSortedData] = useState<SortData[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>(sortOrderParam || "asc")
  const [sortBy, setSortBy] = useState<keyof SortData>(sortByParam || "first_name")

  const sortFunction = useCallback((a: SortData, b: SortData) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1
    } else if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1
    } else {
      return 0
    }
  }, [sortBy, sortOrder])

  useEffect(() => {
    const sorted = [...data].sort(sortFunction)

    setSortedData(sorted)
  }, [data, sortFunction])

  return [setSortBy, setSortOrder, sortedData] as const
}