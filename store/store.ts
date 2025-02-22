import { configureStore } from "@reduxjs/toolkit"
import searchResultsReducer from "./searchResultsSlice"
import booksListReducer from "./booksListSlice"

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    booksList: booksListReducer,
  },
})

// Export store instance for direct access
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
