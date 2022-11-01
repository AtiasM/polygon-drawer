const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fs = require('fs')
const path = require('path')
const videoController = require('../controllers/video.controller')




router.get('/frames', async (req,res) => {
    const token = req.header('auth-token')
    const decodedToken = jwt.decode(token, process.env.TOKEN_SK)
    const id = decodedToken._id
    const user = await User.findOne({_id: id}).populate('videos')
    const video = req.query.video.replace(/\.[^/.]+$/, "")
    const numOFFrame = req.query.frame_number
    const filePath = path.join(__dirname, `../videos/${id}/${video}/${numOFFrame}.png`)
    res.setHeader('content-type', 'image/png')
    return res.sendFile(filePath)

})

router.get('/frame', videoController.getSingleFrame)

router.get('/get-frames', videoController.getFrames)

router.get('/geometric-file', videoController.getGeometricFile)

router.post('/geometric-file', videoController.saveGeometricFile)

router.get('/', videoController.getUserVideoNames)

router.get('/duration', videoController.getDuration)

router.post('/', videoController.uploadVideo )
 

module.exports = router