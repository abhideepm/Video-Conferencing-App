import { Button, Grid, Paper, Typography } from '@material-ui/core'
import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import VideoStream from './VideoStream'
const port = process.env.PORT || 5000
const ENDPOINT = `http://127.0.0.1:${port}/`

const MeetingRoom = () => {
	const { id } = useParams()
	const myPeer = new Peer()
	const socket = io(ENDPOINT)
	const peers = useRef({})
	const [videoStreams, setVideoStreams] = useState([])
	const history = useHistory()

	const addVideoStream = (userVideoStream, muteStatus) => {
		const videoProperties = {
			stream: userVideoStream,
			muted: muteStatus,
		}
		console.log('inside', videoProperties)
		console.log('inside', videoStreams)
		setVideoStreams(videoStreams.concat(videoProperties))
	}
	console.log('outside', videoStreams)

	const removeVideoStream = userStream => {
		setVideoStreams(videoStreams.filter(obj => obj.stream !== userStream))
	}

	const connectToNewUser = (userId, stream) => {
		const call = myPeer.call(userId, stream)
		let otherUserVideoStream = ''
		call.on('stream', userVideoStream => {
			otherUserVideoStream = userVideoStream
			addVideoStream(userVideoStream, false)
		})
		call.on('close', () => {
			removeVideoStream(otherUserVideoStream)
		})
		peers.current[userId] = call
	}

	socket.on('user-disconnected', userId => {
		if (peers.current[userId]) {
			console.log('disconnect client')
			peers.current[userId].close()
			const filteredObj = Object.keys(peers.current)
				.filter(key => key !== userId)
				.reduce((acc, curr) => ({ ...acc, [curr]: peers.current[curr] }), {})
			peers.current = filteredObj
		}
	})

	useEffect(() => {
		myPeer.on('open', userId => {
			socket.emit('join-room', id, userId)
		})

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then(stream => {
				addVideoStream(stream, true)
				myPeer.on('call', call => {
					call.answer(stream)
					let otherUserVideoStream = ''
					call.on('stream', userVideoStream => {
						otherUserVideoStream = userVideoStream
						addVideoStream(userVideoStream, false)
					})
					call.on('close', () => {
						removeVideoStream(otherUserVideoStream)
					})
				})
				socket.on('user-connected', userId => {
					connectToNewUser(userId, stream)
				})
			})
	}, [])

	return (
		<Paper style={{ minHeight: '100vh' }}>
			<Grid container>
				<Grid item xs={12} style={{ textAlign: 'center' }}>
					<Typography variant="h2">Your Meeting ID is:</Typography>
					<Typography variant="h4" color="secondary">
						{id}
					</Typography>
				</Grid>
				{videoStreams.map(videoProp => (
					<VideoStream {...videoProp} />
				))}
				<Grid item xs={12} style={{ textAlign: 'center' }}>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => history.push('/home')}
					>
						Exit Meeting
					</Button>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default MeetingRoom
