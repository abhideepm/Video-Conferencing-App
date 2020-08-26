import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MeetingRoom from './MeetingRoom'

const App = () => {
	return (
		<div>
			<Router>
				<Route path="/meeting/:id" component={MeetingRoom} />
			</Router>
		</div>
	)
}

export default App
