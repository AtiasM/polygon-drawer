const router = require('express').Router()
const User = require('../models/User')
const { userValidation } = require('../validators/user-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path');
const Videos = require('../models/Videos')

router.post('/register', async (req,res) => {
    //validate register request
    const { error } = userValidation(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    //check if user already exist
    let user = await User.findOne({username: req.body.username})
    if(user){
        return res.status(400).send('user already exist!')
    }
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //create videos array
    const videos = new Videos({
        videos: []
    })
    //create user
    user = new User({
        username: req.body.username,
        password: hashedPassword,
        videos: videos
    })
    //saving the user in the db
    try{
        const savedUser = await user.save()
        const savedVideos = await videos.save()
        //create dir for the videos
        fs.mkdir(path.join(__dirname, `../videos/${savedUser._id}`), (err) => {
            if(err){
                console.log(err)
            }
            else{
                console.log('dir created successfully!!')
            }
            
        })
        res.send({id: savedUser._id})

    }catch(err){
        console.log(`got an error ${err}`)
        res.status(400).send(err)
    }
})

router.post('/login', async (req,res) => {
    const { error } = userValidation(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({username: req.body.username})
    if(!user){
        return res.status(400).send('incorrect username')
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).send('incorrect password')
    }
    const token = await jwt.sign({_id:  user._id}, process.env.TOKEN_SK)
    return res.header('auth-token', token).set('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin, auth-token').send(user._id)
})


module.exports = router