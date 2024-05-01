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
	readonly params: { postId: string }
}

const PostPage = async ({ params }: PostPageProps) => {
	const post = await prisma.post.findUnique({
		where: { id: params.postId },
		include: {
			user: true,
			part: true
		}
	})

	console.log('postdata', post)

	// タグを配列にして格納
	// const tagsArray = post?.tags.map((tagItem) => tagItem.tag.name)

	// パーツを配列にして格納

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white">
					<div className="relative">
						{post.videoUrl ? (
							<DynamicVideoPlayer videoUrl={post.videoUrl} controls={true} />
						) : (
							''
							// <video src={post.videoUrl} controls className="w-full h-96 object-cover" />
							// <img src={post.imageUrl || '/default-image.jpg'} alt={post.title} className="w-full h-96 object-cover" />
						)}
					</div>
					<div className="p-8">
						<div className="flex items-center mb-4">
							<img
								src={post.user.image || '/default-avatar.jpg'}
								alt={post.user.name}
								className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
							/>
							<div>
								<p className="text-gray-900 font-semibold">{post.user.name}</p>
								<p className="text-gray-600 text-sm">{formatDate(post.createdat)}</p>
							</div>
						</div>

						<h1 className="text-gray-600 text-2xl sm:text-4xl font-bold py-4">{post.title}</h1>
						{/* <div className="tag">
							{tagsArray?.map((tag, index) => (
								<div key={index} className="text-gray-600 bg-blue-50 rounded-md px-4 py-2 mr-2 mb-2 inline-block">
									#{tag}
								</div>
							))}
						</div> */}

						<h2 className="text-gray-600 font-bold py-4 text-xl sm:text-2xl">パーツ</h2>
						<div className="bg-white rounded-lg py-2">
							{post.part && (
								<ul className="space-y-4">
									<li className="flex items-center">
										<span className="font-semibold flex-shrink-0">ケース:</span>
										<span className="ml-2">{post.part.case}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold flex-shrink-0">プレート:</span>
										<span className="ml-2">{post.part.plate}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold flex-shrink-0">スイッチ:</span>
										<span className="ml-2">{post.part.switches}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold flex-shrink-0">キーキャップ:</span>
										<span className="ml-2">{post.part.keyCaps}</span>
									</li>
								</ul>
							)}
						</div>

						<p className="text-gray-600  leading-relaxed mb-8 py-4 whitespace-pre-wrap">{post.description}</p>
						{/* Add any additional post details or components here */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostPage
