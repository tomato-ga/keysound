'use client'

import { useSession } from 'next-auth/react'

const Session = () => {
	const { data: session, status } = useSession()

	return <div>Session確認: {status}</div>
}

export default Session
