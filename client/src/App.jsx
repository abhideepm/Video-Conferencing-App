import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import Peer from 'peerjs'
const ENDPOINT = `http://127.0.0.1:5000/`

const App = () => {
	const [response, setResponse] = useState('')
	const videoRef = useRef()

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
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				videoRef.current.srcObject = stream
				videoRef.current.addEventListener('loadedmetadata', () => {
					videoRef.current.play()
				})
			})
	}, [])
	return (
		<div>
			{response}
			<video muted ref={videoRef}></video>
		</div>
	)
}

export default App
