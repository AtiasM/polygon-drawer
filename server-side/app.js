const express = require('express')
const mongoose = require('mongoose')
const app = express();
const dotenv = require('dotenv')
const auth = require('./validator')
// const fileupload = require("express-fileupload");
const cors = require('cors')
//import routes
const authRoute = require('./routes/auth')
const exampleRoute = require('./routes/example')
const fileUpload = require('express-fileupload');
const WebSocket = require('ws')
const http = require('http')
// const cv2 = require('opencv4nodejs')


dotenv.config()

//initialize a simple http server
const server = http.createServer(app);

// const wss = new WebSocket.Server({ server : server });

// wss.on('connection', (ws) => {
//     let counter = 0
//     //connection is up, let's add a simple simple event
//     ws.on('getFrames', (filename) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         ws.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     // ws.send('Hi there, I am a WebSocket server');
// });



//conect to DB
mongoose.connect(process.env.DB_CONNECT)
.then(() => console.log('connected to the DB'))
.catch((err) => console.log(`could not connect to the DB -> ${err}`))

app.use(cors())
app.use(fileUpload({
    createParentPath: true
}))

app.use(express.json())
// app.use(fileupload())

//public access routes
app.use('/api/user', authRoute)

//restrict middleware
app.use('/', auth)

//token access only routes
app.use('/api/example', exampleRoute)

//start server
server.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`)
})