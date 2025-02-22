export const setSearchResults = (results: any[]) => ({
  type: "SET_SEARCH_RESULTS",
  payload: results,
})

export const addToBooksList = (book: any) => ({
  type: "ADD_TO_BOOKS_LIST",
  payload: book,
})

export const updateBook = (book: any) => ({
  type: "UPDATE_BOOK",
  payload: book,
})

