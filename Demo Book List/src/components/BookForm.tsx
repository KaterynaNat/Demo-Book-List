import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useBooks } from "../App";
import styles from "./BookForm.module.css";

const BookForm: React.FC = () => {
  const { books, setBooks } = useBooks();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      const book = books.find((b) => b.id === parseInt(id));
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          category: book.category,
          isbn: book.isbn,
        });
      }
    }
  }, [id, books]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.author ||
      !formData.category ||
      !formData.isbn
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    const bookData = {
      ...formData,
      createdAt: id ? undefined : new Date().toISOString(),
      modifiedAt: id ? new Date().toISOString() : null,
      deactivated: false,
    };

    const url = id
      ? `http://localhost:3000/books/${id}`
      : "http://localhost:3000/books";
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(
          id
            ? books.map((b) => (b.id === data.id ? data : b))
            : [...books, data]
        );
        setSuccess(
          id ? "Book updated successfully!" : "Book added successfully!"
        );
        setTimeout(() => {
          setSuccess("");
          navigate("/"); 
        }, 1500);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError("An error occurred while saving the book.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.bookForm}>
      <h1 className={styles.title}>{id ? "Edit Book" : "Add a Book"}</h1>

      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
        </select>
        <input
          name="isbn"
          placeholder="ISBN"
          type="text"
          value={formData.isbn}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Saving..." : id ? "Edit Book" : "Add a Book"}
        </button>
      </form>

      <div className={styles.link}>
        <Link to="/">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default BookForm;
