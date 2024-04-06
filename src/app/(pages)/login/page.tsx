'use client'

import React, { useEffect } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/func/dbUserInsert'
import { checkUserExists } from '@/app/func/checkUserExists'

const LoginPage = () => {
	const { data: session, status } = useSession()

	useEffect(() => {
		const insertUser = async () => {
			if (status === 'authenticated' && session) {
				const name = session.user?.name || ''
				const email = session.user?.email || ''

				if (email) {
					try {
						await insertUserData(name, email)
					} catch (error) {
						console.error('データ挿入時のエラー:', error)
						// 必要に応じてエラーメッセージを表示するなどの処理を行う
					}
				}
			}
		}

		if (status === 'authenticated') {
			insertUser()
		}
	}, [status])

	return (
		<div>
			{status === 'authenticated' && session ? (
				<div>
					<p>セッションの期限：{session.expires}</p>
					<p>ようこそ、{session.user?.name}さん</p>
					<img src={session.user?.image ?? ''} alt="" style={{ borderRadius: '50px' }} />
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
