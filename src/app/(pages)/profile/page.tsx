// src/app/(pages)/profile/page.tsx

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfilePanel from '@/app/components/ProfilePanel'
import Link from 'next/link'

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
			<ProfilePanel profile={profile} />
			<Link href={`/profile/${profile.id}/edit`}>
				<button>プロフィールを編集</button>
			</Link>
		</div>
	)
}
