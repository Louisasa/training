import db from '../db/database';

export function getAllAuthors() {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' +
        'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' +
        'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' +
        'GROUP BY books.bookid ' +
        'ORDER BY bookname';
    return db.any(query);
}

export function getSingleAuthor(authorname) {
    const query = 'SELECT books.bookid, books.bookname, books.copies, books.isbn, ARRAY_AGG(authors.authorname) ' +
        'FROM books INNER JOIN authorsandtheirbooks ON authorsandtheirbooks.bookid = books.bookid ' +
        'INNER JOIN authors ON authors.authorid = authorsandtheirbooks.authorid ' +
        'WHERE authors.authorname = ${name}' +
        'GROUP BY books.bookid ' +
        'ORDER BY bookname';
    return db.any(query, {name: authorname});
}