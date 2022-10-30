const User = require('../models/User.js')
const path = require('path')
const extractFrames = require('ffmpeg-extract-frames')
const jwt = require('jsonwebtoken')
const userService = require('../services/user.service')
const videoService = require('../services/video.service')
const { query } = require('express')

async function uploadVideo(req,res){
    try{
        const user = await userService.getUser(req.header('auth-token'))
        const file = req.files.file
        if(user.videos.videos.includes(file.name)){
            return res.status(400).send('file name already exist, please choose another one.') 
        }
        await videoService.saveVideoOnDisk(file, user)
        await videoService.saveGeometricFile(file.name, user, '{}')
        const duration = await videoService.getVideoDuration(user, file.name)
        user.videos.videos.push(file.name)
        await user.videos.save()
        res.send({data: 'success'})
    }catch(err){ 
        return res.status(400).send(err.message)
    }
}
async function getGeometricFile(req, res){
    const user = await userService.getUser(req.header('auth-token'))
    const geometricFile = await videoService.getGeometricFile(req.query.video, user)
    res.send(geometricFile)
}
async function getUserVideoNames(req, res){
    const user = await userService.getUser(req.header('auth-token'))
    res.send(user.videos.videos)
}
async function saveGeometricFile(req, res){
    const user = await userService.getUser(req.header('auth-token'))
    const videoName = req.body.video
    const geometricFile = req.body.geometric
    await videoService.saveGeometricFile(videoName, user, geometricFile)
    res.send({data: "success"})
}
async function getFrames(req, res){
    const user = await userService.getUser(req.header('auth-token'))
    const videoName = req.query.video
    const frameNumber = req.query.start
    const fps = req.query.fps
    try{
        const framesArray = await videoService.createFrames(videoName, user, frameNumber, fps, 5)
        res.send(framesArray)
    }catch(err){
        res.status(400).send({err: err})
    }

}

module.exports = {
    uploadVideo,
    getUserVideoNames,
    getFrames,
    getGeometricFile,
    saveGeometricFile
}