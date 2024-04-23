// /src/app/(pages)/profile/[userId]/edit/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfileEditForm from '@/app/components/ProfileEditForm'
import { notFound, useParams } from 'next/navigation'
import PostEditForm from '@/app/components/PostEditForm'

interface EditPostProps {
	params: { userId: string }
}

export default async function EditPostPage({ params }: EditPostProps) {
	const userId = params.userId

	if (!userId) {
		return <div className="text-red-500">ユーザーセッションが見つかりません</div>
	}

	const userData = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			posts: {
				include: {
					user: {
						select: {
							name: true,
							image: true
						}
					}
				}
			}
		}
	})

	// console.log('userData', userData)

	if (!userData) {
		notFound()
	}

	return (
		<div className="bg-gray-900 min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8">投稿編集</h1>
				<PostEditForm posts={userData.posts} />
			</div>
		</div>
	)
}
