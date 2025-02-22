"use client"

import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import SearchBar from "../components/SearchBar"
import ResultsList from "../components/ResultsList"
import { setSearchResults, selectCachedResults } from "../store/searchResultsSlice"
import store, { type RootState } from "../store/store"
import { Book } from "../types/book"

const Home = () => {
  const dispatch = useDispatch()
  const searchResults = useSelector((state: RootState) => state.searchResults.results)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchBooks = useCallback(
    async (query: string, direction: "ASC" | "DESC", skipCache = false) => {
      if (!skipCache) {
        const state = store.getState() as RootState
        const cachedResults = selectCachedResults(state, query, direction)

        if (cachedResults) {
          console.log("Using cached results for:", query, direction)
          dispatch(
            setSearchResults({
              data: cachedResults,
              query,
              sortDirection: direction,
            })
          )
          return
        }
      }

      try {
        setIsLoading(true)
        console.log("Fetching fresh data for:", query, direction)
        const encodedQuery = encodeURIComponent(query)
        const response = await axios.get<{ data: Book[] }>(
          `http://64.227.142.191:8080/application-test-v1.1/books?title=${encodedQuery}&DIR=${direction}`
        )

        if (response.data && response.data.data) {
          dispatch(
            setSearchResults({
              data: response.data.data,
              query,
              sortDirection: direction,
            })
          )
        } else {
          dispatch(
            setSearchResults({
              data: [],
              query,
              sortDirection: direction,
            })
          )
        }
        setCurrentPage(1)
      } catch (error) {
        console.error("Error searching books:", error)
        dispatch(
          setSearchResults({
            data: [],
            query,
            sortDirection: direction,
          })
        )
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchBooks("", sortDirection)
  }, [fetchBooks, sortDirection])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    await fetchBooks(query, sortDirection)
  }

  const handleSort = async (direction: "ASC" | "DESC") => {
    setSortDirection(direction)
    await fetchBooks(searchQuery, direction)
  }

  const handleRefresh = async () => {
    await fetchBooks(searchQuery, sortDirection, true)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 left-0 right-0 bg-gray-50 z-30 border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center py-4">
            Book Search App
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <ResultsList
          results={searchResults}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sortDirection={sortDirection}
          onSort={handleSort}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>
    </main>
  )
}

export default Home
