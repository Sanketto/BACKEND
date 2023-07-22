const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config/db')
const { default: mongoose } = require('mongoose')


mongoose.connect(config.db, {useNewUrlParser: true})
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize())

module.exports = app;