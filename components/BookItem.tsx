import type React from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import { addToBooksList } from "../store/booksListSlice"

interface Book {
  id: number
  title: string
  author: string
  year: string
  // Add other book properties as needed
}

interface BookItemProps {
  book: Book
  onEdit: () => void
}

const BookItem: React.FC<BookItemProps> = ({ book, onEdit }) => {
  const dispatch = useDispatch()

  const handleAddToList = async () => {
    try {
      await axios.post("http://64.227.142.191:8080/application-test-v1.1/books", book)
      dispatch(addToBooksList(book))
    } catch (error) {
      console.error("Error adding book to list:", error)
    }
  }

  return (
    <div className="book-item">
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Year: {book.year}</p>
      <button onClick={handleAddToList}>Add to Books List</button>
      <button onClick={onEdit}>Edit</button>
    </div>
  )
}

export default BookItem

