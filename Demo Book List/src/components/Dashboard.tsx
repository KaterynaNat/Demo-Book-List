import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../App";
import styles from "./Dashboard.module.css";

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
    const book = books.find((b) => b.id === id);
    if (!book?.deactivated) return;

    if (!window.confirm("Are you sure you want to delete this book?")) return;

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
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <div className={styles.filter}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.select}
        >
          <option value="all">Show All</option>
          <option value="active">Show Active</option>
          <option value="deactivated">Show Deactivated</option>
        </select>
        <p>
          Showing {filteredBooks.length} of {books.length}
        </p>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>Author Name</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Created At</th>
            <th>Modified/Edited At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr
              key={book.id}
              className={book.deactivated ? styles.deactivated : styles.active}
            >
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.isbn}</td>
              <td>{formatDate(book.createdAt)}</td>
              <td>{formatDate(book.modifiedAt)}</td>
              <td className={`${styles.actions} ${book.deactivated ? "" : styles.actionsActive}`}>
                <button
                  onClick={() => navigate(`/edit/${book.id}`)}
                  className={`${styles.button} ${styles.editButton}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeactivate(book.id)}
                  className={`${styles.button} ${styles.deactivateButton}`}
                >
                  {book.deactivated ? "Re-Activate" : "Deactivate"}
                </button>
                {book.deactivated && (
                  <button
                    onClick={() => handleDelete(book.id)}
                    className={`${styles.button} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.link}>
        <Link to="/add">Add a Book</Link>
      </div>
    </div>
  );
};

export default Dashboard;
