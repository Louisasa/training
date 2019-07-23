var url = require('url');
const express = require("express");

const app = express();
const port = 3000;
app.use(express.static('frontend'));

go();

function go() {

    app.get('/bookish/bookish', async function (req, res) {
        var pgp = require('pg-promise')(/* options */);
        const cn = {
            host: 'localhost', // 'localhost' is the default;
            port: 5432, // 5432 is the default;
            database: 'bookish',
            user: 'postgres',
            password: 'LouNasRocks'
        };

        var db = pgp(cn);

        db.any('SELECT * FROM books')
            .then(function (data) {
                res.json(data);
                console.log('DATA:', data)
            })
            .catch(function (error) {
                console.log('ERROR:', error)
            }).finally(db.$pool.end);

        //res.end();
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}