'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const pgp = require('pg-promise')();
const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'bookish',
    user: 'postgres',
    password: 'LouNasRocks'
};
const db = pgp(cn);

exports.default = db;