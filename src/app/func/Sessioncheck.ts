import { useSession } from 'next-auth/react'

export const SessionCheck = () => {
	const { status } = useSession()

	return status
}
