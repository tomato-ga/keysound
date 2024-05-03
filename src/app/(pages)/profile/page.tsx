import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

export default async function ProfileRedirect() {
	const session = await getServerSession(authOptions)

	if (!session || !session.user || !session.user.email) {
		// ログインしていない場合は、ログインページにリダイレクト
		redirect('/login')
	}

	const userEmail = session.user.email

	// Prismaを使用してユーザーIDを取得
	const user = await prisma.user.findUnique({
		where: { email: userEmail },
		select: { id: true }
	})

	if (!user || !user.id) {
		// ユーザーが見つからない場合は、エラーページにリダイレクト
		redirect('/error')
	}

	const userId = user.id

	// ログインしているユーザーのプロフィールページにリダイレクト
	redirect(`/profile/`)
}
