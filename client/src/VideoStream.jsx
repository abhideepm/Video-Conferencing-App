import { Grid } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'

const VideoStream = ({ video, stream, muted }) => {
	const videoRef = useRef()

	useEffect(() => {
		videoRef.current.srcObject = stream
		videoRef.current.addEventListener('loadedmetadata', () => {
			videoRef.current.play()
		})
	}, [])
	return (
		<Grid item>
			<video muted={muted} ref={videoRef}></video>
		</Grid>
	)
}

export default VideoStream
