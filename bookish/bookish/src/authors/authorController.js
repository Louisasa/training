// AuthorController.js

import { Router } from 'express';
import { getAllAuthors } from "./authorService";
import { getSingleAuthor } from "./authorService";
import url from 'url';

class AuthorController {

    constructor() {
        this.router = Router();
        this.router.get('/', this.getAllAuthors.bind(this));
        this.router.get('/name/', this.getSingleAuthor.bind(this));
    }

    getAllAuthors(request, response) {
        getAllAuthors()
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

    getSingleAuthor(request, response) {
        const q = url.parse(request.url, true).query;
        getSingleAuthor(q.name)
            .then(function (data) {
                response.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            });
    }

}

export default new AuthorController().router;
