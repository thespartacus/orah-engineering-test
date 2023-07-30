import { useState, useEffect, useCallback } from "react"
import { Person } from "shared/models/person"

interface UseSearchProps<SearchData extends Person> {
  data: SearchData[]
  delay?: number
}

export const useSearch = <SearchData extends Person>({ data, delay = 200 }: UseSearchProps<SearchData>) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Person[]>([])

  const handleSearch = useCallback(() => {
    const results = data.filter((item) =>
      searchTerm
        .toLowerCase()
        .split(" ")
        .every((word) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(word)
        )
    )

    setSearchResults(results)
  }, [data, searchTerm])

  useEffect(() => {
    const timer = setTimeout(handleSearch, delay)

    return () => clearTimeout(timer)
  }, [handleSearch, delay])

  return [searchTerm, setSearchTerm, searchResults] as const
}