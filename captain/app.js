const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser');
const app = express();
const connect = require('./db/db')
connect()



const captainRoutes = require('./routes/captain.routes');


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/', captainRoutes)



module.exports = app;