// src/app/(pages)/profile/page.tsx

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfilePanel from '@/app/components/ProfilePanel'

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)
	if (!session || !session.user || !session.user.name) {
		return <div>ユーザーセッションが見つかりません</div>
	}
	const screenName = session.user.name

	// 【1】params.screenNameから、プロフィールを取得
	const profile = await prisma.profile.findUnique({
		where: {
			screenName: screenName
		},
		include: {
			user: true
		}
	})

	if (!profile) {
		// プロフィールが存在しない場合の処理
		return <div>Profile not found</div>
	}

	// 【2】プロフィールを表示
	return (
		<div>
			<h1>{profile.screenName}</h1>
			<p>{profile.bio}</p>
			{/* 他のプロフィール情報を表示 */}
			{/* TODO プロフィールコンポーネント作成する */}
		</div>
	)
}
