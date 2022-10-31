const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fs = require('fs')
const path = require('path')
// const ffmpeg = require('ffmpeg')
const extractFrames = require('ffmpeg-extract-frames')
const videoController = require('../controllers/video.controller')
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);
// const utilitiesService = require('../services/utilities')



router.get('/frames', async (req,res) => {
    const token = req.header('auth-token')
    const decodedToken = jwt.decode(token, process.env.TOKEN_SK)
    const id = decodedToken._id
    const user = await User.findOne({_id: id}).populate('videos')
    
    const video = req.query.video.replace(/\.[^/.]+$/, "")
    const numOFFrame = req.query.frame_number
    const filePath = path.join(__dirname, `../videos/${id}/${video}/${numOFFrame}.png`)
    res.setHeader('content-type', 'image/png')
    //  return res.download(filePath)
    return res.sendFile(filePath)

})

router.get('/frame', videoController.getSingleFrame)
router.get('/get-frames', videoController.getFrames)

router.get('/geometric-file', videoController.getGeometricFile)

router.post('/geometric-file', videoController.saveGeometricFile)

router.get('/', videoController.getUserVideoNames)

router.get('/duration', videoController.getDuration)
// router.get('/user', async(req,res) => {
//     res.send(await utilitiesService.getUser(req.header('auth-token')))
// })

router.post('/', videoController.uploadVideo )
    // try{
    //     const token = req.header('auth-token')
    //     const decodedToken = jwt.decode(token, process.env.TOKEN_SK)
    //     const id = decodedToken._id
    //     const user = await User.findOne({_id: id}).populate('videos')
    //     const file = req.files.file
    //     const isFileNameAlreadyExist = user.videos.videos.reduce((acc, curr) => {
    //         return curr == file.name
    //     }, false)
    //     if(isFileNameAlreadyExist){
    //         return res.status(400).send('filename already exist please choose another one.')
    //     }
    //     const folderName = file.name.replace(/\.[^/.]+$/, "")
    //     const folderPath = `../videos/${id}/${folderName}`
    //     const videoPath = path.join(__dirname, `${folderPath}/${file.name}`)
    //     await file.mv(videoPath, async (err) => {
    //         if(err){
    //             throw new Error(err)
    //         }
    //         else{
    //             user.videos.videos.push(file.name)
    //             await user.videos.save()
    //             // const framesPath = videoPath.replace(/\.[^/.]+$/, "") + '%d.png'
    //             await extractFrames({
    //                 input: videoPath,
    //                 output: path.join(__dirname, folderPath) + '/%d.png'
    //               })
    //             return res.status(200).send({
    //                 result: 'success'
    //             })
    //         }
    //     })

    // }catch(err){
    //     console.log(err)    
    //     return res.status(400).send(err)
    // }

module.exports = router