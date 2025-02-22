import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Book {
  id: number
  title: string
  author: string
  year: string
  // Add other book properties as needed
}

const booksListSlice = createSlice({
  name: "booksList",
  initialState: [] as Book[],
  reducers: {
    addToBooksList: (state, action: PayloadAction<Book>) => {
      state.push(action.payload)
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.findIndex((book) => book.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
  },
})

export const { addToBooksList, updateBook } = booksListSlice.actions
export default booksListSlice.reducer

