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

export function addBook(q) {
    // todo: check if author already exists, then only an entry in authorsandtheirbooks needs to be added
    const bookName = q.bookName;
    const authors = q.authors; // split on commas
    const copies = q.copies; // if undefined only one copy
    const isbn = q.isbn;
    const bookCheckQuery = 'SELECT COUNT(*) FROM books WHERE books.bookname = ${bookName}';
    const bookCheckQueryResult = db.any(bookCheckQuery, {bookName: bookName});
    if (bookCheckQueryResult===0) {
        const query = 'INSERT INTO books VALUES ((SELECT MAX(books.bookid) FROM books)+1, ${bookName}, ${copies}, ${isbn})';
        db.any(query, {bookName: bookName, copies: copies, isbn: isbn});
        // split authors on commas, repeat this and next query for each author
        const author = authors.split(",");
        const authorCheckQuery = 'SELECT COUNT(*) FROM authors WHERE authors.authorid = ${name}';
        for (let index = 0; index < author.length; index++) {
            const authorCheckQueryResult = db.any(authorCheckQuery, {name: author[index]});
            if (authorCheckQueryResult===0) {
                const query2 = 'INSERT INTO authors VALUES ((SELECT MAX(authors.authorid) FROM authors)+1, ${name})';
                db.any(query2, {name: author[index]});
            }
            // todo: change query3 to the actual id of the author and book
            const query3 = 'INSERT INTO authorsandtheirbooks VALUES ((SELECT MAX(authors.authorid) FROM authors), (SELECT MAX(books.bookid) FROM books))';
            db.any(query3);
        }
    } else {
        //todo: update num of copies
    }
}
