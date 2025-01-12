const mongoose = require('mongoose')

async function connect() {
    return mongoose.connect(process.env.MONGO_URL).then(()=> {
        console.log('User service connected to MongoDB')
    }).catch(err => {
        console.log("🚀 ~ mongoose.connect ~ err:", err)
    })
}

module.exports = connect;