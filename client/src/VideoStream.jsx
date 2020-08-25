import React from 'react'
import { Grid } from '@material-ui/core'
import { useRef } from 'react'

const VideoStream = ({ video, stream, muted }) => {
	const videoRef = useRef()
	videoRef.current.srcObject = stream
	videoRef.current.addEventListener('loadedmetadata', () => {
		videoRef.current.play()
	})
	return (
		<Grid item>
			<video muted ref={videoRef}></video>
		</Grid>
	)
}

export default VideoStream
