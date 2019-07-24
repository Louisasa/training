// UserController.js

import { Router } from 'express';
import { allCheckedOutBooks } from "./userService";
import { checkOutBook } from "./userService";
import { returnBook } from "./userService";
import url from 'url';

class UserController {

    constructor() {
        this.router = Router();
        this.router.get('/', this.getCheckedOutBooks.bind(this));
        this.router.get('/checkout/', this.checkOutBook.bind(this));
        this.router.get('/return/', this.returnBook.bind(this));
    }

    getCheckedOutBooks(request, response) {
        const q = url.parse(request.url, true).query;
        allCheckedOutBooks(q.name)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    checkOutBook(request, response) {
        const q = url.parse(request.url, true).query;
        checkOutBook(q.book, q.user)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    returnBook(request, response) {
        const q = url.parse(request.url, true).query;
        returnBook(q.book, q.user)
            .then(function (data) {
                // if data = true, before duedate
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

}

export default new UserController().router;
