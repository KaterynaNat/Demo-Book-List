# Demo Book List

A simple React + TypeScript CRUD application to manage a list of books with filtering options.

## Features

- Add a new book
- Edit existing books
- Deactivate and reactivate books
- Delete deactivated books
- Filter books by status: All, Active, Deactivated
- Responsive and user-friendly design

## Technologies Used

- React with TypeScript
- JSON Server (for fake REST API)
- React Router
- Moment.js (for date formatting)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-list-crud.git
   cd book-list-crud
   ```
   Open the Project Folder in Terminal:
    ```bash
    cd book-management-app
    ```
4. Install All Required Dependencies:
    ```bash
    npm install
     ```
5. Start the Data Server
   The app uses a fake server to store book data via json-server. To start it:
    ```bash
    npx json-server --watch db.json --port 3000
     ```
   After starting, the server will be available at: http://localhost:3000/books
6. Start the App:
   ```bash
   npm run dev
   ```
   Open your browser and go to: http://localhost:5173
📋 How to Use the App
🖥️ Dashboard
   View the list of books in a table.
   Use filters to display only active, deactivated, or all books.
   Each record includes:
   Book title.
   Author name.
   Category.
   ISBN code.
   Created and modified date.
   Buttons for editing, deactivating/reactivating, and deleting.
➕ Add a Book
   Click "Add a Book".
   Fill out the form:
   Book title.
   Author name.
   Category.
   ISBN code.
   Click "Add a Book" to save.
✏️ Edit a Book
   Click "Edit" next to the book.
   Make changes in the form and click "Edit Book".
🔄 Deactivate/Reactivate a Book
   Click "Deactivate" to deactivate a book.
   Click "Re-Activate" to reactivate a book.
🗑️ Delete a Book
   Only deactivated books can be deleted.
   Click "Delete" next to a deactivated book and confirm the deletion.
📋 Design and Styling
📱 Responsive Design
   The app is adapted for mobile devices, tablets, and large screens.
   On mobile devices, the book table is displayed vertically.
🖌️ CSS and Components
   The styling is in a graphite-green theme.
   All components (buttons, tables, forms) have a consistent style.
