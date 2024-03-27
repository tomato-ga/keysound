'use client'

import React, { useEffect } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/utils/supabase/cl'

const LoginPage = () => {
	const { data: session, status } = useSession()

	useEffect(() => {
		// ユーザーが認証されたら、その名前とメールアドレスをデータベースに保存
		if (status === 'authenticated' && session) {
			const name = session.user?.name || ''
			const email = session.user?.email || '' // メールアドレスを取得
			if (email) {
				// メールアドレスがある場合のみ挿入を試みる
				insertUserData(name, email)
			}
		}
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
