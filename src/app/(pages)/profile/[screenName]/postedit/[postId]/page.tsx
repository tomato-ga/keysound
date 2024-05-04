// /src/app/(pages)/profile/[userId]/edit/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfileEditForm from '@/app/components/ProfileEditForm'
import { notFound, useParams } from 'next/navigation'
import PostEditForm from '@/app/components/PostEditForm'
import { PostEditFormData } from '../../../../../../../types'

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

	const postEditFormData: PostEditFormData = {
		id: postData.id,
		title: postData.title,
		description: postData.description,
		imageUrl: postData.imageUrl,
		videoUrl: postData.videoUrl,
		createdat: postData.createdat,
		updatedat: postData.updatedat,
		user: postData.user,
		part: postData.part,
		category: postData.category,
		screenName: params.screenName
	}

	return (
		<div className=" min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<PostEditForm post={postEditFormData} />
			</div>
		</div>
	)
}
