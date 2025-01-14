const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isAvailable: {
        type: Boolean,
        default: false,
    }
})


module.exports = mongoose.model('captain', captainSchema)