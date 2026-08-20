const express = require("express");
const path = require('path')
const http = require('http')
const app = express()
const PORT = process.env.PORT || 4000

// Static files FIRST
app.use(express.static(path.join(__dirname, 'public')))

// Create server and attach Socket.IO BEFORE listening
const server = http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  io.emit('user count', io.engine.clientsCount)

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    io.emit('user count', io.engine.clientsCount)
  })
})

// Listen LAST
server.listen(PORT, () => console.log(`Server on port ${PORT}`))