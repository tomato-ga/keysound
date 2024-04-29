// /src/app/(pages)/profile/[userId]/edit/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfileEditForm from '@/app/components/ProfileEditForm'
import { notFound, useParams } from 'next/navigation'
import PostEditForm from '@/app/components/PostEditForm'

interface EditPostProps {
	params: { userId: string; postId: string }
}

export default async function EditPostPage({ params }: EditPostProps) {
	const userId = params.userId
	const postId = params.postId

	if (!userId || !postId) {
		return <div className="text-red-500">ユーザーセッションが見つかりません</div>
	}

	const postData = await prisma.post.findFirst({
		where: { id: postId, userId },
		include: { part: true, category: true, user: true }
	})

	console.log('postData', postData)

	if (!postData) {
		notFound()
	}

	const postDataForForm = {
		...postData,
		category: postData.category ? postData.category.name : '' // これにより category は string 型になる
	}

	return (
		<div className=" min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<PostEditForm post={postDataForForm} />
			</div>
		</div>
	)
}
