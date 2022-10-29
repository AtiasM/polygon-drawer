const path = require('path')
const extractFrames = require('ffmpeg-extract-frames')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
async function saveVideoOnDisk(file, user){
    const folderPath = createVideoFolderPath(user._id, file.name)
    await file.mv(`${folderPath}/${file.name}`, err => {
        if(err){
            throw new Error(err)
        }
    }) 
}

async function getGeometricFile(filename, user){
    const folderPath = createVideoFolderPath(user._id, filename)
    const buffer = await readFile(`${folderPath}/geometric.json`)
    return JSON.parse(buffer)
}

async function saveFramesOnDisk(file, user){
    const folderPath = createVideoFolderPath(user._id, file.name)
    await extractFrames({
    input: `${folderPath}/${file.name}`,
    output: `${folderPath}/%d.png`
    })
}

async function saveGeometricFile(filename, user, geometricFile){
    const folderPath = createVideoFolderPath(user._id, filename)
    await writeFile(`${folderPath}/geometric.json`, geometricFile, "utf-8")
}   

async function createFrames(filename, user, startIndex, fps, numberOfFrames){
    const rate = Math.floor(1000 / fps)
    const start = startIndex  * rate
    const end = start + rate * numberOfFrames
    const offsets = []
    const folderPath = createVideoFolderPath(user._id, filename)
    for(let i = start; i <= end; i+=rate){
        offsets.push(i)
    }
    await extractFrames({
        input: `${folderPath}/${filename}`,
        output: `${folderPath}/%d.png`,
        offsets: offsets
    })
    return getFramesArray(user, filename,startIndex, offsets)
}

async function getFramesArray(user, filename, index, offsets){
    const frames = []
    const folderPath = createVideoFolderPath(user._id, filename)
    for(let i = 1; i <= 10; i++){
        const frameName = `1_${i.toString()}.png`
        const file = await readFile(`${folderPath}/${frameName}`)
        const base64Frame = Buffer.from(file).toString('base64') 
        frames.push({
            img: base64Frame,
            frameNumber: offsets[i]
        })
        index++;
    }
    return frames
}

function createVideoFolderPath(id, filename){
    const folderName = filename.replace(/\.[^/.]+$/, "")
    return path.join(__dirname, `../videos/${id}/${folderName}`)
}

async function getUserVideoNames(user){
}

function isVideoAlreadyExist(videoName, videos){
    return videos.reduce((acc, curr) => {
        return curr == videoName
    }, false)
}

module.exports = {
    saveVideoOnDisk,
    isVideoAlreadyExist,
    saveFramesOnDisk,
    getUserVideoNames,
    createFrames,
    saveGeometricFile,
    getGeometricFile
}