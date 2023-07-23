const express = require('express')
const app = express()
const cors = require('cors')
cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config/db')
const mongoose  = require('mongoose')
const router = require('./routes/apis')
require('./config/passport')(passport)


const PORT = 5000;

mongoose.connect(config.db, {useNewUrlParser: true})
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/', router)
app.use(passport.initialize())


app.listen(PORT, ()=>{
    console.log("Connected to server on " + PORT);
})

module.exports = app;