import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Book = {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  pageCount: number;
  price: number;
};

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5068/Bookstore')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error loading books:', error);
      });
  }, []);

  const sortedBooks = useMemo(() => {
    const copiedBooks = [...books];
    copiedBooks.sort((a, b) => {
      if (sortAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    return copiedBooks;
  }, [books, sortAscending]);

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Online Bookstore</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label className="me-2">Books per page:</label>
          <select
            value={booksPerPage}
            onChange={(e) => {
              setBooksPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select d-inline-block w-auto"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setSortAscending(!sortAscending)}
        >
          Sort by Title: {sortAscending ? 'A-Z' : 'Z-A'}
        </button>
      </div>

      {currentBooks.map((book) => (
        <div key={book.bookID} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">{book.title}</h3>
            <p className="card-text mb-1"><strong>Author:</strong> {book.author}</p>
            <p className="card-text mb-1"><strong>Publisher:</strong> {book.publisher}</p>
            <p className="card-text mb-1"><strong>ISBN:</strong> {book.isbn}</p>
            <p className="card-text mb-1"><strong>Category:</strong> {book.classification}</p>
            <p className="card-text mb-1"><strong>Pages:</strong> {book.pageCount}</p>
            <p className="card-text"><strong>Price:</strong> ${book.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;