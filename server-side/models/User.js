const mongoose = require('mongoose')
const Videos = require('./Videos')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    videos: {
        ref: Videos,
        type: mongoose.Schema.ObjectId
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)