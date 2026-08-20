const socket = io()
const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

// Random short user ID like "A3x"
const uid = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    + Math.floor(Math.random() * 10)
    + String.fromCharCode(97 + Math.floor(Math.random() * 26))

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        socket.emit('chat message', { uid, text: input.value })
        input.value = ''
    }
})

socket.on('chat message', (msg) => {
    const li = document.createElement('li')
    const isMe = msg.uid === uid
    li.className = isMe ? 'me' : 'other'
    li.innerHTML = `<div class="uid">${msg.uid}</div><div class="text">${msg.text}</div>`
    messages.appendChild(li)
    messages.scrollTop = messages.scrollHeight
})
