import React from 'react'
import { prisma } from '@/app/lib/prisma'
import { formatDate } from '@/app/func/postFunc'

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
		<div className="bg-gray-900 min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
					<div className="relative">
						{post.videoUrl ? (
							<video src={post.videoUrl} controls className="w-full h-96 object-cover" />
						) : (
							<img src={post.imageUrl || '/default-image.jpg'} alt={post.title} className="w-full h-96 object-cover" />
						)}
						<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
							<h1 className="text-cyan-400 text-4xl font-bold">{post.title}</h1>
						</div>
					</div>
					<div className="p-8">
						<div className="flex items-center mb-4">
							<img
								src={post.user.image || '/default-avatar.jpg'}
								alt={post.user.name}
								className="w-12 h-12 rounded-full mr-4"
							/>
							<div>
								<p className="text-cyan-400 font-semibold text-lg">{post.user.name}</p>
								<p className="text-gray-500 text-sm">{formatDate(post.createdat)}</p>
							</div>
						</div>
						<p className="text-gray-300 text-lg leading-relaxed mb-8">{post.description}</p>
						{/* Add any additional post details or components here */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostPage
