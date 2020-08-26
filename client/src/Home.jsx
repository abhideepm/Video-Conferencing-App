import { Button, Grid, Typography, Paper } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

const Home = () => {
	const history = useHistory()
	return (
		<Paper style={{ minHeight: '100vh' }}>
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
				<Grid item justify="center" spacing={1} container>
					<Grid item>
						<Button
							variant="contained"
							size="large"
							color="secondary"
							onClick={() => history.push(`/meeting/${uuidV4()}`)}
						>
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
		</Paper>
	)
}

export default Home
