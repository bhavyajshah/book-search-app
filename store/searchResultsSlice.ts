import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import { Book } from "../types/book"

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

interface CacheEntry {
  data: Book[]
  timestamp: number
  query: string
  sortDirection: "ASC" | "DESC"
}

interface SearchResultsState {
  results: Book[]
  cache: { [key: string]: CacheEntry }
  isFormOpen: boolean
  selectedBook: Book | undefined
  isLoading: boolean
  lastUpdated: number | null
}

const initialState: SearchResultsState = {
  results: [],
  cache: {},
  isFormOpen: false,
  selectedBook: undefined,
  isLoading: false,
  lastUpdated: null,
}

export const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    setSearchResults: (
      state,
      action: PayloadAction<{
        data: Book[]
        query: string
        sortDirection: "ASC" | "DESC"
      }>
    ) => {
      const { data, query, sortDirection } = action.payload
      state.results = data
      state.lastUpdated = Date.now()
      const cacheKey = `${query}-${sortDirection}`
      state.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        query,
        sortDirection,
      }
    },
    openBookForm: (state, action: PayloadAction<Book | undefined>) => {
      state.selectedBook = action.payload
      state.isFormOpen = true
    },
    closeBookForm: (state) => {
      state.isFormOpen = false
      state.selectedBook = undefined
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateBookInResults: (state, action: PayloadAction<Book>) => {
      const updatedBook = action.payload
      // Find the index of the book to update
      const index = state.results.findIndex((book) => book.id === updatedBook.id)
      if (index !== -1) {
        // Update the book at its current position
        state.results[index] = updatedBook
        
        // Update book in cache while maintaining position
        Object.keys(state.cache).forEach((key) => {
          const cacheIndex = state.cache[key].data.findIndex(
            (book) => book.id === updatedBook.id
          )
          if (cacheIndex !== -1) {
            state.cache[key].data[cacheIndex] = updatedBook
          }
        })
      }
    },
    addBookToResults: (state, action: PayloadAction<Book>) => {
      const newBook = action.payload
      state.results.unshift(newBook)
      // Add book to cache
      Object.keys(state.cache).forEach((key) => {
        state.cache[key].data.unshift(newBook)
      })
    },
    clearCache: (state) => {
      state.cache = {}
      state.lastUpdated = null
    },
  },
})

export const {
  setSearchResults,
  openBookForm,
  closeBookForm,
  setLoading,
  updateBookInResults,
  addBookToResults,
  clearCache,
} = searchResultsSlice.actions

export const selectCachedResults = (
  state: RootState,
  query: string,
  sortDirection: "ASC" | "DESC"
): Book[] | null => {
  const cacheKey = `${query}-${sortDirection}`
  const cachedEntry = state.searchResults.cache[cacheKey]

  if (
    cachedEntry &&
    Date.now() - cachedEntry.timestamp < CACHE_DURATION &&
    cachedEntry.query === query &&
    cachedEntry.sortDirection === sortDirection
  ) {
    return cachedEntry.data
  }

  return null
}

export default searchResultsSlice.reducer
