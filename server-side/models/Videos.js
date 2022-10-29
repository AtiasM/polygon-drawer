const mongoose = require('mongoose')

const  videosSchema = new mongoose.Schema({
    videos: [String],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Videos', videosSchema)