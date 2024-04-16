// /Users/donbe/Codes/keysound/src/app/(pages)/post/[postId]/page.tsx

import React from 'react'
import { prisma } from '@/app/lib/prisma'
import { formatDate } from '@/app/func/postFunc'
import dynamic from 'next/dynamic'

const DynamicVideoPlayer = dynamic<{ videoUrl: string; controls: boolean }>(
	() => import('../../../components/VideoPlayer'),
	{ ssr: false }
)

interface PostPageProps {
	params: { postId: string }
}

const PostPage = async ({ params }: PostPageProps) => {
	const post = await prisma.post.findUnique({
		where: { id: params.postId },
		include: { user: true }
	})

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white pl-8 m-4 ">
					<div className="relative">
						{post.videoUrl ? (
							<DynamicVideoPlayer videoUrl={post.videoUrl} controls={true} />
						) : (
							// <video src={post.videoUrl} controls className="w-full h-96 object-cover" />
							<img src={post.imageUrl || '/default-image.jpg'} alt={post.title} className="w-full h-96 object-cover" />
						)}
					</div>
					<div className="p-8">
						<div className="flex items-center mb-4">
							<img
								src={post.user.image || '/default-avatar.jpg'}
								alt={post.user.name}
								className="w-12 h-12 rounded-full mr-4"
							/>
							<div>
								<p className="text-gray-900 font-semibold text-lg">{post.user.name}</p>
								<p className="text-gray-600 text-sm">{formatDate(post.createdat)}</p>
							</div>
						</div>
						<h1 className="text-gray-600 text-2xl font-bold py-4">{post.title}</h1>
						<p className="text-gray-600  leading-relaxed mb-8 py-4 whitespace-pre-wrap">{post.description}</p>
						{/* Add any additional post details or components here */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostPage
