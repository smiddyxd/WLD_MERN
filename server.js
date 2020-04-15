const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const items = require('./routes/api/items')

const app = express()

// bodyParser middleware
app.use(bodyParser.json())

// DB config
const db = require('./config/keys').mongoURI

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err))

// Use routes
app.use('/api/items', items)

const port = process.env.PORT || 5000

app.listen(port, () => console.log('server started on ' + port))


// mysql

// var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "asdqwe123",
//     database: "mydb"
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected to mysql");
//     let sql = ''
//     // sql = "CREATE DATABASE mydb"
//     sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))"
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Database created");
//     });
// });


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdqwe123',
    database: 'mydb'
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('connected')
    console.log('The solution is: ', results[0].solution);
});

connection.end();
