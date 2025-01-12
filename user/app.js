const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser');
const app = express();
const connect = require('./db/db')
connect()



const userRoutes = require('./routes/user.routes');


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/', userRoutes)



module.exports = app;