import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Peer from 'peerjs'
const ENDPOINT = `http://127.0.0.1:5000/`

const App = () => {
	const [response, setResponse] = useState('')

	useEffect(() => {
		const myPeer = new Peer({
			host: '/',
			port: '5001',
		})
		const socket = io(ENDPOINT)

		socket.on('Hello', data => {
			setResponse(data)
		})

		myPeer.on('open', id => {
			socket.emit('join-room', id)
		})
	}, [])
	return <div>{response}</div>
}

export default App
