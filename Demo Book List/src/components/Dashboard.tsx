import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../App";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

const Dashboard: React.FC = () => {
  const { books, setBooks } = useBooks();
  const [filter, setFilter] = useState<string>("active");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      console.log("Success Message Set:", successMessage);
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredBooks = books.filter((book) => {
    if (filter === "active") return !book.deactivated;
    if (filter === "deactivated") return book.deactivated;
    return true;
  });

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/books/${id}`, { method: "DELETE" })
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
        setSuccessMessage("Book deleted successfully!");
      })
      .catch((error) => console.error("Delete error:", error));
  };

  const handleDeactivate = (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    fetch(`http://localhost:3000/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deactivated: !book.deactivated }),
    })
      .then(() => {
        setBooks(
          books.map((b) =>
            b.id === id ? { ...b, deactivated: !b.deactivated } : b
          )
        );
        setSuccessMessage(
          book.deactivated
            ? "Book re-activated successfully!"
            : "Book deactivated successfully!"
        );
      })
      .catch((error) => console.error("Deactivate error:", error));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary text-center">
        Dashboard
      </h1>

      {}
      {successMessage && (
        <div className="text-center mb-4 text-green-600 transition-opacity duration-500 ease-in-out opacity-100">
          {successMessage}
        </div>
      )}

      <div className="mb-4 text-center">
        <select
          className="border p-2 mb-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Show All</option>
          <option value="active">Show Active</option>
          <option value="deactivated">Show Deactivated</option>
        </select>
        <p className="text-sm text-gray-600">
          Showing {filteredBooks.length} of {books.length}
        </p>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-2">Book Title</th>
              <th className="p-2">Author Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">ISBN</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Modified/Edited At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr
                key={book.id}
                className={`border ${
                  book.deactivated ? "bg-red-100" : "bg-white"
                } transition`}
              >
                <td className="p-2">{book.title}</td>
                <td className="p-2">{book.author}</td>
                <td className="p-2">{book.category}</td>
                <td className="p-2">{book.isbn}</td>
                <td className="p-2">{formatDate(book.createdAt)}</td>
                <td className="p-2">{formatDate(book.modifiedAt)}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${book.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeactivate(book.id)}
                    className={`${
                      book.deactivated ? "text-green-500" : "text-yellow-500"
                    } hover:underline`}
                  >
                    {book.deactivated ? "Re-Activate" : "Deactivate"}
                  </button>
                  {book.deactivated && (
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/add"
        className="text-primary hover:underline text-center block mb-4"
      >
        Add a Book
      </Link>
    </div>
  );
};

export default Dashboard;
