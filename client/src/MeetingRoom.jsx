import { Grid, Paper } from '@material-ui/core'
import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import VideoStream from './VideoStream'
const ENDPOINT = `http://127.0.0.1:5000/`

const MeetingRoom = () => {
	const history = useHistory()
	const { id } = useParams()
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
			console.log('room-connected')
			roomId.current = id
			console.log(roomId.current)
		})
		myPeer.on('open', id => {
			console.log('open')
			socket.emit('join-room', roomId.current, id)
		})
		socket.on('Hello', data => {
			setResponse(data)
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
		<Paper style={{ minHeight: '100vh' }}>
			<Grid container>
				{response}
				{videoStreams.map(videoProp => (
					<VideoStream {...videoProp} />
				))}
			</Grid>
		</Paper>
	)
}

export default MeetingRoom
