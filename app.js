const express = require("express");
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`Server on port ${PORT}`))
app.use(express.static(path.join(__dirname, 'public')))

// Socket.IO
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})