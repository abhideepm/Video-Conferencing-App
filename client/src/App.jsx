import React from 'react'
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom'
import Home from './Home'
import JoinMeeting from './JoinMeeting'
import MeetingRoom from './MeetingRoom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'

const App = () => {
	const theme = createMuiTheme({ palette: { type: 'dark' } })
	return (
		<>
			<ThemeProvider theme={theme}>
				<Router>
					<Switch>
						<Route exact path="/meeting/:id" component={MeetingRoom} />
						<Route exact path="/join" component={JoinMeeting} />
						<Route exact path="/home" component={Home} />
						<Redirect from="/" to="/home" />
					</Switch>
				</Router>
			</ThemeProvider>
		</>
	)
}

export default App
