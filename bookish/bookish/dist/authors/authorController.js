"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _authorService = require("./authorService");

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// AuthorController.js

class AuthorController {

    constructor() {
        this.router = (0, _express.Router)();
        this.router.get('/', this.getAllAuthors.bind(this));
        this.router.get('/name/', this.getSingleAuthor.bind(this));
    }

    getAllAuthors(request, response) {
        (0, _authorService.getAllAuthors)().then(function (data) {
            response.json(data);
            console.log('DATA:', data);
        }).catch(function (error) {
            console.log('ERROR:', error);
        });
    }

    getSingleAuthor(request, response) {
        const q = _url2.default.parse(request.url, true).query;
        (0, _authorService.getSingleAuthor)(q.name).then(function (data) {
            response.json(data);
            console.log('DATA:', data);
        }).catch(function (error) {
            console.log('ERROR:', error);
        });
    }

}

exports.default = new AuthorController().router;