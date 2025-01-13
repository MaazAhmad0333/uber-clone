const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express()

app.use('/user', expressProxy('http://localhost:3001')) // If any user request comes it will redirect it to localhost 3001


app.listen(3000, ()=> {
    console.log('Gateway server started on Port 3000')
})