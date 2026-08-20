const socket = io()
const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')
const messagesContainer = document.getElementById('messages-container')
const welcomeMsg = document.getElementById('welcome-msg')

// Random short user ID like "A3x"
const uid = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    + Math.floor(Math.random() * 10)
    + String.fromCharCode(97 + Math.floor(Math.random() * 26))

// Track if we've received the first real message
let hasMessages = false

// Sanitize text to prevent XSS
function sanitize(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (text) {
        socket.emit('chat message', { uid, text })
        input.value = ''
        // Refocus input on mobile after send
        input.focus()
    }
})

socket.on('chat message', (msg) => {
    // Hide welcome message on first real message
    if (!hasMessages && welcomeMsg) {
        welcomeMsg.style.display = 'none'
        hasMessages = true
    }

    const li = document.createElement('li')
    const isMe = msg.uid === uid
    li.className = isMe ? 'me' : 'other'
    li.innerHTML = `<div class="uid">${sanitize(msg.uid)}</div><div class="text">${sanitize(msg.text)}</div>`
    messages.appendChild(li)

    // Smooth scroll to bottom
    requestAnimationFrame(() => {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        })
    })
})

socket.on('user count', (count) => {
    document.getElementById('online-count').textContent = count + ' online'
})

// Fix mobile viewport height when virtual keyboard opens
function setAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', setAppHeight)
setAppHeight()

// Prevent page bounce on iOS
document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('#messages-container')) return
    e.preventDefault()
}, { passive: false })
