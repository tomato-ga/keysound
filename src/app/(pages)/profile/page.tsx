import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { redirect } from 'next/navigation'

export default async function ProfileRedirect() {
	const session = await getServerSession(authOptions)

	if (!session || !session.user || !session.user.id) {
		// ログインしていない場合は、ログインページにリダイレクト
		redirect('/login')
	}

	const userId = session.user.id

	// ログインしているユーザーのプロフィールページにリダイレクト
	redirect(`/profile/${userId}`)
}
