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
