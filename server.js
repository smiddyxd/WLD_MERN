const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const axios = require('axios')

const fs = require('fs');
const url = require('url');
// const YTClient = require('./YoutubeAPI/YTClient')


const app = express()

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(bodyParser.json({ limit: '50mb' }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const db = require('./models')

// const playlists = require('./routes/api/playlists')


function storeToken(token) {
    fs.writeFile('./YoutubeAPI/storedToken.json', JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to storedToken.json');
    });
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

const client_id = '563856617839-5plsi2jjd76jv7n9strql1hufi8co6vb.apps.googleusercontent.com'
const client_secret = '1AXfp0i06cPhkHV9Hn1pZCCv'
const redirect_uri = 'http://localhost:3000'

// app.get("/passCode", (req, res) => {
//     let code = req.query.code
//     res.json({ message: "Code passed: " + code });
//     console.log('code: ' + code)
//     body = 'code=' 
//     + encodeURIComponent(code)
//     + '&client_id='
//     + client_id
//     + '&client_secret='
//     + client_secret
//     + '&redirect_uri='
//     + redirect_uri
//     + '&grant_type=authorization_code'

//     axios.request({
//         url: 'https://oauth2.googleapis.com/token',
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         data: body
//     })
//     .then(resp => {
//         console.log(resp)
//         fs.writeFile('resp.json', JSON.stringify(resp.data), (err) => {
//             if (err) throw err;
//             console.log('The file has been saved!');
//         });
//     })
//     .catch(function (error) {
//         console.log(error)
//   });
// });

require("./routes/api/playlist.routes")(app);
require("./routes/api/video.routes")(app);
require("./routes/api/auth.routes")(app);

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('server started on ' + port)
    // authorize
    // YTClient.authorize()
    // somehow show on frontend if app is still not authorized
    // do this by requesting every second on a route that gives information on whether app is authorized or not 
})


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
// db.sequelize.sync({alter: true})
// db.sequelize.sync({force: true})
