import db from '../db/database';

export function allCheckedOutBooks(name) {
    const query = 'SELECT book.bookName, borrowed.duedate FROM books, borrowed, users WHERE users.username = ${name} AND users.userid = borrowed.userid AND borrowed.bookid = books.bookid'
    return db.any(query, {name: name});
}

export function checkOutBook(bookid, userid) {
    const d = new Date();
    //add 3 months?
    const month = d.getMonth()+3;
    const year = month>12 ? d.getFullYear()+1 : d.getFullYear();
    const query = 'INSERT INTO borrowed VALUES( ${bookid}, ${userid}, ${duedate})';
    db.any(query, {bookid: bookid, userid: userid, duedate: d.setFullYear(year, month%12, d.getDate())})
}

export function returnBook(bookid, userid) {
    //get due date
    let query = 'SELECT borrowed.duedate FROM borrowed WHERE borrowed.userid = ${userid} AND borrowed.bookid = ${bookid}';
    const duedate = db.any(query, {bookid:bookid, userid:userid});
    const d = new Date();
    query = 'DELETE FROM borrowed WHERE borrowed.userid = ${userid} AND borrowed.bookid = ${bookid}';
    db.any(query, {bookid:bookid, userid:userid});
    return duedate.getTime() - d.getTime() > 0;
}