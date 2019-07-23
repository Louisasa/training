'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllAuthors = getAllAuthors;
exports.getSingleAuthor = getSingleAuthor;

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAllAuthors() {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' + 'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' + 'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' + 'GROUP BY books.bookid ' + 'ORDER BY bookname';
    return _database2.default.any(query);
}

function getSingleAuthor(authorname) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' + 'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' + 'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' + 'WHERE authors.authorname = ${name}' + 'GROUP BY books.bookid ' + 'ORDER BY bookname';
    return _database2.default.any(query, { name: authorname });
}