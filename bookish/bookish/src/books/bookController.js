// BookController.js

import { Router } from 'express';
import { getAllBooks } from "./bookService";
import { getSingleBook } from "./bookService";
import { getAvailableCopies } from "./bookService";
import { addBook } from "./bookService";
import url from 'url';

class BookController {

    constructor() {
        this.router = Router();
        this.router.get('/', this.getAllBooks.bind(this));
        this.router.get('/name/', this.getSingleBook.bind(this));
        this.router.get('/copies/', this.getAvailableCopies.bind(this));
        this.router.post('/addBook/', this.addBook.bind(this));
    }

    getAllBooks(request, response) {
        const q = url.parse(request.url, true).query;
        getAllBooks(q.page)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    getSingleBook(request, response) {
        const q = url.parse(request.url, true).query;
        getSingleBook(q.name)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    getAvailableCopies(request, response) {
        const q = url.parse(request.url, true).query;
        getAvailableCopies(q.name)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    addBook(request, response) {
        const q = url.parse(request.url, true).query;
        addBook(q)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

}

export default new BookController().router;
