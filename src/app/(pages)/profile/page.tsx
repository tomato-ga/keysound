// src/app/(pages)/profile/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfilePanel from '@/app/components/ProfilePanel'
import Link from 'next/link'

// 関連する新しい関数定義
const truncateDescription = (description: string, maxLength: number = 100) => {
	if (description.length <= maxLength) {
		return description
	}
	return description.slice(0, maxLength) + '...'
}

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)
	if (!session || !session.user || !session.user.name) {
		return <div>ユーザーセッションが見つかりません</div>
	}

	// 【1】params.screenNameから、プロフィールを取得
	const profile = await prisma.profile.findFirst({
		where: {
			user: { name: session.user.name }
		},
		include: {
			user: {
				include: {
					posts: true
				}
			}
		}
	})

	console.log('profile', profile)

	if (!profile) {
		// プロフィールが存在しない場合の処理
		return <div>Profile not found</div>
	}

	// 【2】プロフィールを表示
	return (
		<>
			<ProfilePanel profile={profile} />
			<Link href={`/profile/${profile.id}/edit`}>
				<button>プロフィールを編集</button>
			</Link>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{profile.user.posts.map((post) => (
					<div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="relative">
							{post.videoUrl ? (
								<video src={post.videoUrl} controls className="w-full h-48 md:h-64 object-cover" />
							) : (
								<img
									src={post.imageUrl || '/default-image.jpg'} // デフォルト画像のパスを適切に設定してください
									alt={post.title}
									className="w-full h-48 md:h-64 object-cover"
								/>
							)}
							<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
								<h3 className="text-white text-xl font-semibold">{post.title}</h3>
							</div>
						</div>
						<div className="p-6">
							<p className="text-gray-600 mb-4">{truncateDescription(post.description)}</p>
							<Link href={`/post/${post.id}`}>
								<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">詳細を見る</button>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
