'use client'

import React from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'

const LoginPage = () => {
	const { data: session, status } = useSession()
	return (
		<div>
			{status === 'authenticated' ? (
				<div>
					<p>セッションの期限：{session.expires}</p>
					<p>ようこそ、{session.user?.name}さん</p>
					<img src={session.user?.image ?? ``} alt="" style={{ borderRadius: '50px' }} />
					<div>
						<Logout />
					</div>
				</div>
			) : (
				<Login />
			)}
		</div>
	)
}

export default LoginPage
