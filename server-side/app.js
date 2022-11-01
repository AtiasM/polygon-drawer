const express = require('express')
const mongoose = require('mongoose')
const app = express();
const dotenv = require('dotenv')
const auth = require('./validator')

const cors = require('cors')
//import routes
const authRoute = require('./routes/auth')
const videoRoute = require('./routes/video')
const fileUpload = require('express-fileupload');
const http = require('http')

dotenv.config()

const server = http.createServer(app);

//connect to DB
mongoose.connect(process.env.DB_CONNECT)
.then(() => console.log('connected to the DB'))
.catch((err) => console.log(`could not connect to the DB -> ${err}`))

app.use(cors())
app.use(fileUpload({
    createParentPath: true
}))

app.use(express.json())


//public access routes
app.use('/api/user', authRoute)

//restrict middleware
app.use('/', auth)

//token access only routes
app.use('/api/video', videoRoute)

//start server
server.listen(process.env.PORT, () => {
    console.log(`server is listening on port ${process.env.PORT}`)
})