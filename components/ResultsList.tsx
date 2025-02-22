import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Book } from "../types/book"
import { openBookForm } from "../store/searchResultsSlice"
import type { RootState } from "../store/store"
import BookForm from "./BookForm"
import axios from "axios"

interface ResultsListProps {
  results: Book[]
  currentPage: number
  setCurrentPage: (page: number) => void
  sortDirection: "ASC" | "DESC"
  onSort: (direction: "ASC" | "DESC") => void
  isLoading: boolean
  onRefresh: () => Promise<void>
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  currentPage,
  setCurrentPage,
  sortDirection,
  onSort,
  isLoading,
  onRefresh,
}) => {
  const dispatch = useDispatch()
  const [isFormLoading, setIsFormLoading] = useState(false)
  const isFormOpen = useSelector((state: RootState) => state.searchResults.isFormOpen)
  const selectedBook = useSelector((state: RootState) => state.searchResults.selectedBook)
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedResults = results.slice(startIndex, endIndex)
  const totalPages = Math.ceil(results.length / itemsPerPage)

  const handleAddBook = () => {
    dispatch(openBookForm(undefined))
  }

  const handleEditBook = (book: Book) => {
    dispatch(openBookForm(book))
  }

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Sort Controls and Add Button */}
      <div className="sticky top-0 bg-gray-50 z-10 py-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              className={`button-secondary ${
                sortDirection === "ASC" && "bg-blue-500 text-white"
              } text-sm sm:text-base`}
              onClick={() => onSort("ASC")}
              disabled={isLoading}
            >
              Sort Ascending
            </button>
            <button
              className={`button-secondary ${
                sortDirection === "DESC" && "bg-blue-500 text-white"
              } text-sm sm:text-base`}
              onClick={() => onSort("DESC")}
              disabled={isLoading}
            >
              Sort Descending
            </button>
          </div>
          <button
            onClick={handleAddBook}
            className="button-primary text-sm sm:text-base"
            disabled={isLoading}
          >
            Add New Book
          </button>
        </div>
        {!isLoading && results.length > 0 && (
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Showing {startIndex + 1}-{Math.min(endIndex, results.length)} of{" "}
            {results.length} results
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-300px)]">
        {isLoading ? (
          <LoadingSpinner />
        ) : displayedResults.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayedResults.map((book) => (
              <div key={book.id} className="book-card">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <div className="space-y-1 text-sm sm:text-base text-gray-600">
                  <p>
                    <span className="font-medium">Author:</span> {book.author}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span> {book.year}
                  </p>
                  <p>
                    <span className="font-medium">Country:</span> {book.country}
                  </p>
                  <p>
                    <span className="font-medium">Language:</span> {book.language}
                  </p>
                  <p>
                    <span className="font-medium">Pages:</span> {book.pages}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {book.link && (
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 hover:underline text-sm sm:text-base"
                    >
                      View Book →
                    </a>
                  )}
                  <button
                    onClick={() => handleEditBook(book)}
                    className="button-secondary text-sm sm:text-base"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No results found</p>
            <p className="text-gray-400 mt-2">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Fixed Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="button-secondary disabled:opacity-50 text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
              >
                Previous
              </button>
              <span className="px-3 py-1 sm:px-4 sm:py-2 bg-white border rounded-lg text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="button-secondary disabled:opacity-50 text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Form Modal */}
      {isFormOpen && (
        <BookForm
          book={selectedBook}
          isLoading={isFormLoading}
          onClose={() => dispatch({ type: "searchResults/closeBookForm" })}
          onSubmit={async (bookData) => {
            try {
              setIsFormLoading(true)
              if (bookData.id) {
                // Edit existing book
                await axios.put(
                  `https://64.227.142.191:8080/application-test-v1.1/books/${bookData.id}`,
                  bookData
                )
                dispatch({ type: "searchResults/updateBookInResults", payload: bookData })
              } else {
                // Add new book
                await axios.post(
                  "http://64.227.142.191:8080/application-test-v1.1/books",
                  bookData
                )
                // Immediately refresh the data to show the new book
                await onRefresh()
              }
              dispatch({ type: "searchResults/closeBookForm" })
            } catch (error) {
              console.error("Error saving book:", error)
              alert("Error saving book. Please try again.")
            } finally {
              setIsFormLoading(false)
            }
          }}
        />
      )}
    </div>
  )
}

export default ResultsList
