import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import Peer from 'peerjs'
const ENDPOINT = `http://127.0.0.1:5000/`
import { Grid } from '@material-ui/core'

const App = () => {
	const [response, setResponse] = useState('')
	const videoRef = useRef()
	const myPeer = new Peer()
	const socket = io(ENDPOINT)
	const peers = {}

	const connectToNewUser = (userId, stream) => {
		const call = myPeer.call(userId, stream)
		const video = document.createElement('video') //Not muted
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
		call.on('close', () => {
			video.remove()
		})
		peers[userId] = call
	}

	const onCall = () => {
		myPeer.on('call', call => {
			call.answer(stream)
			const video = document.createElement('video') //Not muted
			call.on('stream', userVideoStream => {
				addVideoStream(video, userVideoStream)
			})
			call.on('close', () => {
				video.remove()
			})
		})
	}

	const onDisconnect = () => {
		socket.on('user-disconnected', userId => {
			if (peers[userId]) peers[userId].close()
		})
	}

	useEffect(() => {
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

				socket.on('user-connected', userId => {
					connectToNewUser(userId, stream)
				})
			})
	}, [])
	return (
		<>
			<Grid>
				{response}
				<video muted ref={videoRef}></video>
			</Grid>
		</>
	)
}

export default App
