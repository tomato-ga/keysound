// src/app/(pages)/profile/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfilePanel from '@/app/components/ProfilePanel'
import Link from 'next/link'
import { truncateDescription, formatDate } from '@/app/func/postFunc'

export default async function ProfilePage() {
	const session = await getServerSession(authOptions)
	if (!session || !session.user || !session.user.name) {
		return <div className="text-red-500">ユーザーセッションが見つかりません</div>
	}

	const profile = await prisma.profile.findFirst({
		where: { user: { name: session.user.name } },
		include: { user: { include: { posts: true } } }
	})

	if (!profile) {
		return <div className="text-red-500">Profile not found</div>
	}

	return (
		<div className="bg-gray-900 min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<ProfilePanel profile={profile} />
				<Link href={`/profile/${profile.user.id}/edit`}>
					<button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
						プロフィールを編集
					</button>
				</Link>
				<h2 className="mt-8 mb-4 text-2xl font-bold">投稿一覧</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
					{profile.user.posts.map((post) => (
						<div key={post.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
							<Link href={`/post/${post.id}`}>
								<div className="relative">
									{post.videoUrl ? (
										<video src={post.videoUrl} controls className="w-full h-48 md:h-64 object-cover" />
									) : (
										<img
											src={post.imageUrl || '/default-image.jpg'}
											alt={post.title}
											className="w-full h-48 md:h-64 object-cover"
										/>
									)}
									<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
										<h3 className="text-cyan-400 text-xl font-semibold">{post.title}</h3>
									</div>
								</div>
								<div className="p-6">
									<p className="text-gray-400 mb-4">{truncateDescription(post.description)}</p>
									<p className="text-gray-500 text-sm">{formatDate(post.updatedat)}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
