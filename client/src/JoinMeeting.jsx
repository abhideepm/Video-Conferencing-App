import React from 'react'
import { Grid, Typography, TextField, Button, Paper } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

const JoinMeeting = () => {
	const history = useHistory()
	return (
		<Paper style={{ minHeight: '100vh' }}>
			<Grid
				container
				spacing={2}
				alignItems="center"
				justify="center"
				direction="column"
				style={{ minHeight: '100vh' }}
			>
				<Grid item>
					<Typography variant="h1">Join A Meeting</Typography>
				</Grid>
				<Grid item>
					<Typography variant="h2">Enter the Meeting ID below</Typography>
				</Grid>
				<Grid item>
					<TextField
						label="Meeting ID"
						type="text"
						name="meetingID"
						id="meetingID"
						color="secondary"
						style={{ minWidth: '100vh' }}
					/>
				</Grid>
				<Grid item></Grid>
				<Grid item container direction="column" alignItems="center" spacing={2}>
					<Grid item>
						<Button size="large" color="secondary" variant="contained">
							Submit
						</Button>
					</Grid>
					<Grid item>
						<Button
							size="large"
							color="primary"
							variant="contained"
							onClick={() => history.push(`/meeting/${uuidV4()}`)}
						>
							Create Meeting
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default JoinMeeting
