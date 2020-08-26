import React from 'react'
import { Grid, Typography, TextField, Button } from '@material-ui/core'

const JoinMeeting = () => {
	return (
		<>
			{' '}
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
				<Grid item>
					<Button size="large" color="secondary" variant="contained">
						Submit
					</Button>
				</Grid>
			</Grid>
		</>
	)
}

export default JoinMeeting
