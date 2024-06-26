// /Users/ore/Documents/GitHub/keysound/src/app/(pages)/profile/[screenName]/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import ProfilePanel from '@/app/components/ProfilePanel'
import ProfilePostsCard from '@/app/components/ProfilePostsCard'

export default async function ProfilePage({ params }: { params: { screenName: string } }) {
	const decodedScreenName = decodeURIComponent(params.screenName)
	console.log(decodedScreenName, params.screenName)

	const session = await getServerSession(authOptions)
	if (!session || !session.user || !session.user.email) {
		return <div className="text-red-500">ユーザーセッションが見つかりません</div>
	}

	const profile = await prisma.profile.findUnique({
		where: { screenName: decodedScreenName },
		include: {
			user: {
				include: {
					posts: {
						include: { user: true },
						orderBy: {
							updatedat: 'desc'
						}
					}
				}
			}
		}
	})

	console.log('profile確認', profile)

	if (!profile) {
		return <div className="text-red-500">プロフィールが見つかりません。しばらくしてからもう一度お試しください。</div>
	}

	const isCurrentUser = session?.user?.email === profile.user.email

	return (
		<div className="bg-white">
			<div className="container mx-auto px-4 py-8">
				<ProfilePanel profile={profile} />
				{isCurrentUser && (
					<Link href={`/profile/${profile.screenName}/edit`}>
						<button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
							プロフィールを編集
						</button>
					</Link>
				)}
				<h2 className="mt-8 mb-4 text-2xl font-bold">投稿一覧</h2>
				<ProfilePostsCard posts={profile.user.posts} isCurrentUser={isCurrentUser} screenName={params.screenName} />
			</div>
		</div>
	)
}
