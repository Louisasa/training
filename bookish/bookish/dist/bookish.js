'use strict';

var _bookController = require('./books/bookController');

var _bookController2 = _interopRequireDefault(_bookController);

var _authorController = require('./authors/authorController');

var _authorController2 = _interopRequireDefault(_authorController);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const port = 3000;

app.use('/books', _bookController2.default);
app.use('/authors', _authorController2.default);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function go() {

    // app.get('/bookish/bookish', function (req, res) {
    //     const q = url.parse(req.url, true).query;
    //     const bookName = q.book;
    //     const author = q.author;
    //     const copiesOf = q.bookCopies;
    //     const checkedOutBy = q.user;
    //     let result;
    //     let query = 'SELECT * FROM books ORDER BY bookname';
    //     if (bookName !== undefined) {
    //         query = 'SELECT * FROM books, authorsandtheirbooks, authors WHERE bookname = ${name} AND books.bookid = authorsandtheirbooks.bookid AND authorsandtheirbooks.authorid = authors.authorid ORDER BY bookname';
    //         result = bookName;
    //     }
    //     if (author !== undefined) {
    //         query = 'SELECT * FROM books, authorsandtheirbooks, authors WHERE books.bookid = authorsandtheirbooks.authorid AND authors.authorname = ${name} AND authors.authorid = authorsandtheirbooks.authorid';
    //         result = author;
    //     }
    //     if (checkedOutBy !== undefined) {
    //         query = 'SELECT * FROM books, borrowed, users WHERE users.username = ${name} AND users.userid = borrowed.userid AND borrowed.bookid = books.bookid'
    //         result = checkedOutBy;
    //     }
    //     if (copiesOf !== undefined) {
    //         query = 'SELECT books.copies, books.copies - COUNT(' +
    //             'SELECT * ' +
    //             'FROM books, borrowed ' +
    //             'WHERE books.bookid = borrowed.bookid ' +
    //             'AND books.bookid = ${name}) as numberAvailable, users.username, borrowed.duedate ' +
    //             'WHERE books.bookid = ${name} AND book.bookid = borrowed.bookid AND borrowed.userid = users.userid'
    //     }
    //     db.any(query, {name: result})
    //         .then(function (data) {
    //             res.json(data);
    //             console.log('DATA:', data)
    //         })
    //         .catch(function (error) {
    //             console.log('ERROR:', error)
    //         });
    // });


    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}