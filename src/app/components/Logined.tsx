

import { useSession, signIn } from 'next-auth/react'
import Logout from './Logout'

export default function Logined() {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		return <div>Loading...</div>
	}

	if (status !== 'authenticated') {
		return (
			<div>
				<p>ログインしていません</p>
				<button onClick={() => signIn('google', {}, { prompt: 'login' })}>Googleでログイン</button>
			</div>
		)
	}

	if (status === 'authenticated') {
		return (
			<div>
				<p>セッションの期限：{session.expires}</p>
				<p>ようこそ、{session.user?.name}さん</p>
				<img src={session.user?.image ?? ``} alt="" style={{ borderRadius: '50px' }} />
				<div>
					<Logout />
				</div>
			</div>
		)
	}
}
