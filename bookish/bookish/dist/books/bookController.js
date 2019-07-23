"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _bookService = require("./bookService");

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// BookController.js

class BookController {

    constructor() {
        this.router = (0, _express.Router)();
        this.router.get('/', this.getAllBooks.bind(this));
        this.router.get('/name/', this.getSingleBook.bind(this));
        this.router.get('/copies/', this.getAvailableCopies.bind(this));
        this.router.get('/addBook/', this.addBook.bind(this));
    }

    getAllBooks(request, response) {
        const q = _url2.default.parse(request.url, true).query;
        (0, _bookService.getAllBooks)(q.page).then(function (data) {
            response.json(data);
            console.log('DATA:', data);
        }).catch(function (error) {
            console.log('ERROR:', error);
        });
    }

    getSingleBook(request, response) {
        const q = _url2.default.parse(request.url, true).query;
        (0, _bookService.getSingleBook)(q.name).then(function (data) {
            response.json(data);
            console.log('DATA:', data);
        }).catch(function (error) {
            console.log('ERROR:', error);
        });
    }

    getAvailableCopies(request, response) {
        const q = _url2.default.parse(request.url, true).query;
        (0, _bookService.getAvailableCopies)(q.name).then(function (data) {
            response.json(data);
            console.log('DATA:', data);
        }).catch(function (error) {
            console.log('ERROR:', error);
        });
    }

    addBook(request, response) {
        const q = _url2.default.parse(request.url, true).query;
        (0, _bookService.addBook)(q);
    }

}

exports.default = new BookController().router;