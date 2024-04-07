// LoginPage.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/func/dbUserInsert'

const LoginPage = () => {
	const { data: session, status } = useSession()
	const [userExists, setUserExists] = useState(false)

	useEffect(() => {
		const insertUser = async () => {
			if (status === 'authenticated' && session) {
				const name = session.user?.name || ''
				const email = session.user?.email || ''
				const image = session.user?.image || ''
				if (email) {
					try {
						const result = await insertUserData(name, email, image)
						setUserExists(result.userExists)
					} catch (error) {
						console.error('データ挿入時のエラー:', error)
						// エラーメッセージを表示するなどの適切な処理を行う
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
					{userExists && <p>ユーザーは既に存在します</p>}
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
