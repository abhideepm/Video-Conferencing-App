import { Button, Grid, Paper, Typography } from '@material-ui/core'
import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import VideoStream from './VideoStream'
const port = process.env.PORT || 5000
// const ENDPOINT = `http://127.0.0.1:${port}/`

const MeetingRoom = () => {
	const { id } = useParams()
	const myPeer = new Peer()
	const socket = io()
	const peers = useRef({})
	const [videoStreams, setVideoStreams] = useState([])
	const history = useHistory()

	const addVideoStream = (userVideoStream, muteStatus) => {
		const videoProperties = {
			stream: userVideoStream,
			muted: muteStatus,
		}
		setVideoStreams(curr => {
			let flag = true
			curr.forEach(val => {
				if (val.stream.id === videoProperties.stream.id) {
					flag = false
				}
			})
			if (flag) return [...curr, videoProperties]
			else return curr
		})
	}
	console.log(videoStreams)
	const removeVideoStream = userStream => {
		setVideoStreams(videoStreams.filter(obj => obj.stream !== userStream))
	}

	const connectToNewUser = (userId, stream) => {
		console.log('connectToNewUser')
		const call = myPeer.call(userId, stream)
		let otherUserVideoStream = ''
		call.on('stream', userVideoStream => {
			otherUserVideoStream = userVideoStream
			console.log('new user')
			addVideoStream(userVideoStream, false)
		})
		call.on('close', () => {
			removeVideoStream(otherUserVideoStream)
		})
		peers.current[userId] = call
	}

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
						console.log('answer a call')
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

		socket.on('user-disconnected', userId => {
			if (peers.current[userId]) {
				peers.current[userId].close()
				delete peers.current[userId]
			}
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
