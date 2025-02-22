"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import { updateBook } from "../store/booksListSlice"

interface Book {
  id: number
  title: string
  author: string
  country: string
  language: string
  link: string
  pages: string
  year: string
}

interface EditBookModalProps {
  book: Book
  onClose: () => void
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, onClose }) => {
  const [editedBook, setEditedBook] = useState(book)
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put(`http://64.227.142.191:8080/application-test-v1.1/books/${book.id}`, editedBook)
      dispatch(updateBook(editedBook))
      onClose()
    } catch (error) {
      console.error("Error updating book:", error)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={editedBook.title} onChange={handleChange} placeholder="Title" />
          <input name="author" value={editedBook.author} onChange={handleChange} placeholder="Author" />
          <input name="country" value={editedBook.country} onChange={handleChange} placeholder="Country" />
          <input name="language" value={editedBook.language} onChange={handleChange} placeholder="Language" />
          <input name="link" value={editedBook.link} onChange={handleChange} placeholder="Link" />
          <input name="pages" value={editedBook.pages} onChange={handleChange} placeholder="Pages" />
          <input name="year" value={editedBook.year} onChange={handleChange} placeholder="Year" />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal

