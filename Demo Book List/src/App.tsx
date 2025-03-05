import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa"; 
import Dashboard from "./components/Dashboard";
import BookForm from "./components/BookForm";
import "./App.css";

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
      .then((response) => response.json())
      .then(setBooks)
      .catch(console.error);
  }, []);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      <Router>
        <div className="app">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<BookForm />} />
              <Route path="/edit/:id" element={<BookForm />} />
            </Routes>
          </div>
          <footer className="footer">
            <div className="footer-icons">
              <a
                href="https://github.com/KaterynaNat"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="footer-icon-link"
              >
                <FaGithub className="footer-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/kateryna-naturkach"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="footer-icon-link"
              >
                <FaLinkedin className="footer-icon" />
              </a>
            </div>
            <p className="footer-text">Connect with me on GitHub and LinkedIn!</p>
          </footer>
        </div>
      </Router>
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBooks must be used within a BookProvider");
  return context;
};

export default App;
