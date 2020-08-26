import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MeetingRoom from './MeetingRoom'
import { Grid, Typography, Button, makeStyles } from '@material-ui/core'

// TODO Add background image

const App = () => {
	return (
		<div>
			<Grid
				container
				spacing={0}
				alignItems="center"
				justify="center"
				style={{ minHeight: '100vh' }}
			>
				<Grid item style={{ textAlign: 'center' }}>
					<Typography variant="h1">
						Welcome to Video Conferencing App
					</Typography>
				</Grid>
				<Grid item justify="center" spacing={2} container>
					<Grid item>
						<Button variant="contained" size="large" color="secondary">
							Create a Room
						</Button>
					</Grid>
					<Grid item>
						<Button variant="contained" size="large" color="primary">
							Join a Room
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<Router>
				<Route path="/meeting/:id" component={MeetingRoom} />
			</Router>
		</div>
	)
}

export default App
