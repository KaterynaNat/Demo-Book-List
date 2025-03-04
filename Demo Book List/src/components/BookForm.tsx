import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useBooks } from "../App";

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
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 my-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        {id ? "Edit Book" : "Add a Book"}
      </h1>

      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
          } transition duration-200`}
        >
          {loading ? "Saving..." : id ? "Edit Book" : "Add a Book"}
        </button>
      </form>

      <Link
        to="/"
        className="block text-center text-primary mt-4 hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default BookForm;
