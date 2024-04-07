import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfilePanel from '@/app/components/ProfilePanel'

interface Props {
	params: { screenName: string }
}

export default async function Page({ params }: Props) {
	// 【1】params.screenNameから、プロフィールを取得
	const profile = await prisma.profile.findUnique({
		where: {
			screenName: params.screenName
		},
		include: {
			user: true
		}
	})

	if (!profile) {
		// プロフィールが見つからない場合の処理
		return <>プロフィールが見つかりません</>
	}

	// 【2】特定したユーザーのIDで、投稿一覧を取得
	const photos = await prisma.post.findMany({
		where: {
			userId: profile.userId
		},
		include: {
			tags: true
		},
		take: 15 // 最大15件取得
	})

	return (
		<>
			プロフィールパネル予定
			{/* <ProfilePanel
				// imageUrl={profile.user.image}
				name={profile.user.name || ''}
				screenName={profile.screenName || ''}
				bio={profile.bio || ''}
			/> */}
		</>
	)
}
