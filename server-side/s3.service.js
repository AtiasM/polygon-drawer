// const S3ClientModule = require('@aws-sdk/client-s3')

// const region = "ap-northeast-1"
// const accessKeyId = "AKIAX26JUG7RT7DYIRMV"
// const secretKey = 
// debugger
// AWS.config.update({
//   region: process.env.S3_REGION,
//   credentials: {
//     accessKeyId: process.env.S3_AK,
//     secretAccessKey: process.env.S3_SK
//   }
// })

// const s3Instance = new S3ClientModule.S3Client({credentials: {
//   accessKeyId: process.env.S3_AK,
//   secretAccessKey: process.env.S3_SK,
//   region: process.env.S3_REGION
// }})

// module.exports = {
//   AWS,
  // s3Instance
// }
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_AK;
const secretAccessKey = process.env.S3_SK;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// UPLOAD FILE TO S3*
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}

// DOWNLOAD FILE FROM S3*
function getFileStream(fileKey){
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  }
  return s3.getObject(downloadParams).createReadStream();
}
  
module.exports = { uploadFile, getFileStream };

