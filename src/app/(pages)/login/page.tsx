'use client'

import React, { useEffect } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/utils/supabase/dbUserInsert'
import { checkUserExists } from '@/app/utils/supabase/dbUserCheck'

const LoginPage = () => {
	const { data: session, status } = useSession()

	useEffect(() => {
		const checkAndInsertUser = async () => {
			if (status === 'authenticated' && session) {
				const name = session.user?.name || ''
				const email = session.user?.email || ''

				// TODO imageの値を確認する
				const image = session.user?.image || ''

				if (email) {
					const exists = await checkUserExists(email)

					try {
						if (!exists) {
							console.log('ユーザーは存在しません')
							console.log(name, email)
							await insertUserData(name, email) //TODO ここでAPI呼び出してもうまくいかない
						}
					} catch (error) {
						// console.error('データ挿入時のエラー:', error)
					}
				}
			}
		}

		checkAndInsertUser()
	}, [status, session])

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
