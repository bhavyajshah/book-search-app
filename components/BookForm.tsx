import React, { useState, useEffect } from "react"
import { Book } from "../types/book"

interface BookFormProps {
  book?: Book
  onSubmit: (bookData: Omit<Book, "id"> & { id?: number }) => Promise<void>
  onClose: () => void
  isLoading: boolean
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Omit<Book, "id"> & { id?: number }>({
    title: "",
    author: "",
    country: "",
    language: "",
    link: "",
    pages: "",
    year: "",
  })

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        pages: String(book.pages || ""),
        year: String(book.year || ""),
        link: book.link || "",
      })
    }
  }, [book])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      id: book?.id,
      // Ensure all required fields are strings
      title: String(formData.title).trim(),
      author: String(formData.author).trim(),
      country: String(formData.country).trim(),
      language: String(formData.language).trim(),
      pages: String(formData.pages).trim(),
      year: String(formData.year).trim(),
      link: formData.link ? String(formData.link).trim() : "",
    }
    await onSubmit(submitData)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-2xl font-semibold text-gray-900">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="close-button"
            disabled={isLoading}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="book-form" className="space-y-6">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter book title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  Author*
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter author name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Year*
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter publication year"
                />
              </div>
              <div className="form-group">
                <label htmlFor="pages" className="form-label">
                  Pages*
                </label>
                <input
                  type="text"
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter number of pages"
                />
              </div>
              <div className="form-group">
                <label htmlFor="language" className="form-label">
                  Language*
                </label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter book language"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  Country*
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="link" className="form-label">
                Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter book link (optional)"
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary px-6"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="book-form"
            className="button-primary px-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="loading-spinner" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookForm
