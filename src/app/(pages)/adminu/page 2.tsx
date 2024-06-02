// /Users/ore/Documents/GitHub/keysound/src/app/(pages)/adminu/page.tsx

import { redirect } from 'next/navigation'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/auth/[...nextauth]'

const AdminuPage = async () => {
	const session: Session | null = await getServerSession(authOptions)
	const isLoggedIn = session?.user?.email === 'katudon@gmail.com'

	console.log('isLoggedIn', session?.user?.email)
	console.log('isLoggedIn', isLoggedIn)

	if (!!isLoggedIn) {
		redirect('adminu/postlists')
	}

	return <div>{/* 管理者ページのコンテンツ */}</div>
}

export default AdminuPage
