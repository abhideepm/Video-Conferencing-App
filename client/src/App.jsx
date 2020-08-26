import { Grid, Button } from '@material-ui/core'
import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import VideoStream from './VideoStream'
const ENDPOINT = `http://127.0.0.1:5000/`

const App = () => {
	const [response, setResponse] = useState('')
	const myPeer = new Peer()
	const socket = io(ENDPOINT)
	const [peers, setPeers] = useState({})
	const [videoStreams, setVideoStreams] = useState([])
	const roomId = useRef()

	const addVideoStream = (userId, userVideoStream, muteStatus) => {
		const videoProperties = {
			id: userId,
			stream: userVideoStream,
			muted: muteStatus,
		}
		setVideoStreams(videoStreams.concat(videoProperties))
	}

	const removeVideoStream = userId => {
		setVideoStreams(videoStreams.filter(obj => obj.id !== userId))
	}

	const connectToNewUser = (userId, stream) => {
		const call = myPeer.call(userId, stream)
		call.on('stream', userVideoStream => {
			addVideoStream(userId, userVideoStream, false)
		})
		call.on('close', () => {
			removeVideoStream(userId)
		})
		setPeers({ ...peers, userId: call })
		myPeer.on('call', call => {
			call.answer(stream)
			call.on('stream', userVideoStream => {
				addVideoStream(userId, userVideoStream, false)
			})
			call.on('close', () => {
				removeVideoStream(userId)
			})
		})
	}

	socket.on('user-disconnected', userId => {
		if (peers[userId]) {
			peers[userId].close()
			const filteredObj = Object.keys(peers)
				.filter(key => key !== userId)
				.reduce((acc, curr) => ({ ...acc, [curr]: peers[curr] }), {})
			setPeers(filteredObj)
		}
	})

	useEffect(() => {
		socket.on('room-connected', id => {
			roomId.current = id
			console.log(roomId.current)
		})
		socket.on('Hello', data => {
			setResponse(data)
		})

		myPeer.on('open', id => {
			socket.emit('join-room', roomId, id)
		})
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				socket.on('user-connected', userId => {
					connectToNewUser(userId, stream)
				})
			})
	}, [])

	return (
		<>
			<Grid container>
				{response}
				{videoStreams.map(videoProp => (
					<VideoStream {...videoProp} />
				))}
			</Grid>
		</>
	)
}

export default App
