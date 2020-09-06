const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
require('dotenv').config()
const path = require('path')

const port = process.env.PORT || 5000

app.use((req, res, next) => {
	if (req.url === '/favicon.ico') {
		res.writeHead(200, { 'Content-Type': 'image/x-icon' })
		res.end()
	} else {
		next()
	}
})

app.get('/room/:id', (req, res) => {
	res.send(req.params.id)
})

io.on('connection', socket => {
	console.log('Client connected')
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId)
		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId)
		})
	})
})

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')))

	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname + '/client/build/index.html'))
	})
}

server.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
