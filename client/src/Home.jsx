import { Button, Grid, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

// TODO Add background image

const Home = () => {
	const history = useHistory()
	return (
		<>
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
						<Button
							variant="contained"
							size="large"
							color="primary"
							onClick={() => history.push('/join')}
						>
							Join a Room
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default Home
