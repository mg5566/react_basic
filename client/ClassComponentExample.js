import React, { Component } from 'react'
import Axios from 'axios'

export default class Hello extends Component {

	constructor(props) {
		super(props);
		this.state = { name: "" };
	}

	componentDidMount() {
		Axios.get('/api/user/name')
			.then(response => {
				this.setState({ name: response.data.name })
			})
	}

	render() {
		return (
			<div>
				{this.state.name} is !!Fucking!! Class Component
			</div>
		)
	}
}
