const express = require('express')
const app = express()
const cors = require('cors')
cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config/db')
const mongoose  = require('mongoose')
const router = require('./routes/apis')
const dotenv = require('dotenv')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDocs = require('swagger-jsdoc')
require('./config/passport')(passport)


const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "online store API",
            version: "1.0.0",
            description: "A simple API"
        },
        servers:[
            {
                url: "http://localhost:5000"
            }
        ] 
    },
    apis: ["./routes/*.js" ]
};
const specs = swaggerJsDocs(options)
mongoose.connect(config.db, {useNewUrlParser: true})
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/', router)
app.use(passport.initialize())
dotenv.config()

app.listen(PORT, ()=>{
    console.log("Connected to server on " + PORT);
})

module.exports = app;