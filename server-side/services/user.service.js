
const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function getUser(token){
    const decodedToken = jwt.decode(token, process.env.TOKEN_SK)
    const id = decodedToken._id
    return await User.findOne({_id: id}).populate('videos')
}

module.exports = {
    getUser
}