import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BookForm from "./components/BookForm";
import "./index.css";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  createdAt: string;
  modifiedAt: string | null;
  deactivated: boolean;
}

interface BookContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const BookContext = createContext<BookContextType | null>(null);

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched books:", data);
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  console.log("Books from API:", books);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      <Router>
        <div className="min-h-screen bg-background text-text p-4">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<BookForm />} />
              <Route path="/edit/:id" element={<BookForm />} />
            </Routes>
            <footer className="mt-auto text-center py-4 border-t">
              <a
                href="https://github.com/KaterynaNat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            </footer>
          </div>
        </div>
      </Router>
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  console.log("BookContext value:", context);
  if (!context) throw new Error("useBooks must be used within a BookProvider");
  return context;
};

export default App;
