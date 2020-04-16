const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

const db = require('./models')

// const playlists = require('./routes/api/playlists')

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/api/playlist.routes")(app);

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


// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'asdqwe123',
//     database: 'mydb'
// });

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('connected')
//     console.log('The solution is: ', results[0].solution);
// });

// connection.end();

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

db.sequelize.sync()
