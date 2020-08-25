import { Grid } from '@material-ui/core'
import Peer from 'peerjs'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
const ENDPOINT = `http://127.0.0.1:5000/`

const App = () => {
	const [response, setResponse] = useState('')
	const myPeer = new Peer()
	const socket = io(ENDPOINT)
	const [peers, setPeers] = useState({})
	const [videoStreams, setVideoStreams] = useState([])

	const addVideoStream = (userId, userVideoStream, muteStatus) => {
		const videoProperties = {
			id: userId,
			stream: userVideoStream,
			muted: muteStatus,
		}
		setVideoStreams(videoStreams.concat(videoProperties))
	}

	const connectToNewUser = (userId, stream) => {
		const call = myPeer.call(userId, stream)
		call.on('stream', userVideoStream => {
			addVideoStream(userId, userVideoStream, false)
		})
		call.on('close', () => {
			video.remove()
		})
		setPeers({ ...peers, userId: call })
	}

	const onCall = () => {
		myPeer.on('call', call => {
			call.answer(stream)
			call.on('stream', userVideoStream => {
				addVideoStream(userId, userVideoStream, false)
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
