// /src/app/(pages)/profile/[userId]/edit/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfileEditForm from '@/app/components/ProfileEditForm'
import { notFound, useParams } from 'next/navigation'
import PostEditForm from '@/app/components/PostEditForm'

interface EditPostProps {
	params: { screenName: string; postId: string }
}

export default async function EditPostPage({ params }: EditPostProps) {
	if (!params.screenName) {
		return <div className="text-red-500">ユーザーセッションが見つかりません</div>
	}

	const postData = await prisma.post.findUnique({
		where: { id: params.postId },
		include: {
			user: true,
			part: true,
			category: true
		}
	})

	console.log('postData', postData)

	if (!postData) {
		notFound()
	}

	return (
		<div className=" min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				{/* TODO 型から修正して、アップデートできるように */}
				<PostEditForm post={postData} />
			</div>
		</div>
	)
}
