export const searchResultsReducer = (state = [], action: any) => {
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      return action.payload
    default:
      return state
  }
}

export const booksListReducer = (state = [], action: any) => {
  switch (action.type) {
    case "ADD_TO_BOOKS_LIST":
      return [...state, action.payload]
    case "UPDATE_BOOK":
      return state.map((book: any) => (book.id === action.payload.id ? action.payload : book))
    default:
      return state
  }
}

