const router = require('express').Router()
const videoController = require('../controllers/video.controller')

router.get('/frame', videoController.getSingleFrame)

router.get('/get-frames', videoController.getFrames)

router.get('/geometric-file', videoController.getGeometricFile)

router.post('/geometric-file', videoController.saveGeometricFile)

router.get('/', videoController.getUserVideoNames)

router.get('/duration', videoController.getDuration)

router.post('/', videoController.uploadVideo )
 

module.exports = router