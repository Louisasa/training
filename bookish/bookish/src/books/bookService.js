import db from '../db/database';

export function getAllBooks(page) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' +
        'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' +
        'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' +
        'GROUP BY books.bookid ' +
        'ORDER BY bookname ' +
        'LIMIT 10 ' +
        'OFFSET ' + (page-1)*10;
    return db.any(query);
}

export function getSingleBook(bookname) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' +
        'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' +
        'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' +
        'WHERE books.bookname = ${name} ' +
        'GROUP BY books.bookid ' +
        'ORDER BY bookname';
    return db.any(query, {name: bookname});
}

export function getAvailableCopies(bookname) {
    const query = 'SELECT books.copies, books.copies - ' +
        '(SELECT COUNT(*) FROM borrowed WHERE borrowed.bookid = ${name})' +
        ' AS available_copies, borrowed.duedate, users.username ' +
        'FROM borrowed INNER JOIN books ON books.bookid = borrowed.bookid ' +
        'INNER JOIN users ON users.userid = borrowed.userid ' +
        'WHERE books.bookid = ${name}';
    return db.any(query, {name: bookname});
}

function getIdFOrBookName(bookName) {
    const query = 'SELECT COUNT(*) FROM books WHERE books.bookname = ${bookName}';
    const result = db.any(query, {bookName: bookName});
    return result>0 ? result : undefined;
}

function incrementCopiesForBook(bookID, copies) {
    const query = 'UPDATE books SET books.copies = ${copies} WHERE books.bookid = ${bookID}';
    db.any(query, {bookID: bookID, copies: copies});
}

function createIDForBook() {
    const query = 'SELECT MAX(books.bookid) FROM books';
    return db.any(query)+1;
}

function addBookToTable(bookName, idOfBook, copies, isbn) {
    const query = 'INSERT INTO books VALUES (${idOfBook}, ${bookName}, ${copies}, ${isbn})';
    db.any(query, {bookName: bookName, idOfBook: idOfBook, copies: copies, isbn: isbn});
}

function getOrCreateAuthorId(authorName) {
    const query = 'SELECT COUNT(*) FROM authors WHERE authors.authorid = ${name}';
    const result = db.any(query, {name: authorName});
    return result>0 ? result : createAuthorId();
}

function createAuthorId() {
    const query = 'SELECT MAX(authors.authorid) FROM authors)+1';
    return db.any(query);
}

function addToAuthorsAndTheirBooks(authorId, bookId) {
    const query3 = 'INSERT INTO authorsandtheirbooks VALUES (${author}, ${book})';
    db.any(query3, {author: authorId, book: bookId});
}

export function addBook(q) {
    // todo: check if author already exists, then only an entry in authorsandtheirbooks needs to be added
    const bookName = q.bookName;
    const authorList = q.authors; // split on commas
    const copies = q.copies; // if undefined only one copy
    const isbn = q.isbn;
    const bookID = getIdFOrBookName(bookName);
    if (bookID===undefined) {
        const idOfBook = createIDForBook();
        addBookToTable(bookName, idOfBook, copies, isbn);
        // split authors on commas, repeat this and next query for each author
        const authors = authorList.split(",");
        const authorIds = authors.map(getOrCreateAuthorId);
        for (let index = 0; index < authorIds.length; index++) {
            addToAuthorsAndTheirBooks(authorIds[index], idOfBook);
        }
    } else {
        incrementCopiesForBook(bookID, copies);
    }
}

