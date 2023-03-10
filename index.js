require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')


const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Welcome to Chat BackEnd")
})

// Instances
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Socket
io.on('connection', (socket) => {
    console.log(`User connected : ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message",(data)=>{
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
      console.log("User disconnected",socket.id);
    })
})

//PORT
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`App is listening in  port ${PORT}`)
})