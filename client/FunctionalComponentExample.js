import React, { useEffect, useState } from 'react'
import Axios from 'axios'

export default function Hello() {

	const [Name, setName] = useState("")

	useEffect(() => {
		Axios.get('/api/user/name')
			.then(response => {
				setName(response.data.name)
			})
	}, [])

	return (
		<div>
			{Name} is FUC functional componet KING!!!
		</div>
	)
}
