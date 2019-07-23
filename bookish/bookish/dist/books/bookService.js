'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllBooks = getAllBooks;
exports.getSingleBook = getSingleBook;
exports.getAvailableCopies = getAvailableCopies;
exports.addBook = addBook;

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllBooks(page) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' + 'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' + 'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' + 'GROUP BY books.bookid ' + 'ORDER BY bookname ' + 'LIMIT 10 ' + 'OFFSET ' + (page - 1) * 10;
    return _database2.default.any(query);
}

function getSingleBook(bookname) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' + 'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' + 'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' + 'WHERE books.bookname = ${name} ' + 'GROUP BY books.bookid ' + 'ORDER BY bookname';
    return _database2.default.any(query, { name: bookname });
}

function getAvailableCopies(bookname) {
    const query = 'SELECT books.copies, books.copies - ' + '(SELECT COUNT(*) FROM borrowed WHERE borrowed.bookid = ${name})' + ' AS available_copies, borrowed.duedate, users.username ' + 'FROM borrowed INNER JOIN books ON books.bookid = borrowed.bookid ' + 'INNER JOIN users ON users.userid = borrowed.userid ' + 'WHERE books.bookid = ${name}';
    return _database2.default.any(query, { name: bookname });
}

function addBook(q) {
    console.log(q);
    const bookName = q.bookName;
    const authors = q.authors; // split on commas
    const copies = q.copies; // if undefined only one copy
    const isbn = q.isbn;
    const query = 'INSERT INTO books VALUES ((SELECT MAX(books.bookid) FROM books)+1, ${bookName}, ${copies}, ${isbn})';
    _database2.default.any(query, { bookName: bookName, copies: copies, isbn: isbn });
    // split authors on commas, repeat this and next query for each author
    const author = authors.split(",");
    for (let index = 0; index < author.length; index++) {
        const query2 = 'INSERT INTO authors VALUES ((SELECT MAX(authors.authorid) FROM authors)+1, ${name})';
        _database2.default.any(query2, { name: author[index] });
        const query3 = 'INSERT INTO authorsandtheirbooks VALUES ((SELECT MAX(authors.authorid) FROM authors), (SELECT MAX(books.bookid) FROM books))';
        _database2.default.any(query3);
    }
}