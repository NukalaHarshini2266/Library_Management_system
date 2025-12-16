import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

const DeleteBook = () => {
  const [books, setBooks] = useState([]);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Delete book by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/api/books/delete/${encodeURIComponent(id)}`);
      alert("Book deleted successfully!");
      // Remove the deleted book from state so UI updates
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete book!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-danger">Delete Book</h2>

      {books.length === 0 ? (
        <p className="text-center">No books available.</p>
      ) : (
        <div className="list-group">
          {books.map((book) => (
            <div
              key={book.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{book.title}</strong> by {book.author}
              </span>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteBook;
