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
			tags: {
				include: {
					tag: true
				}
			},
			part: true
		}
	})

	// タグを配列にして格納
	const tagsArray = post?.tags.map((tagItem) => tagItem.tag.name)

	// パーツを配列にして格納

	if (!post) {
		return <div>Post not found</div>
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white m-4 ">
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

						<h1 className="text-gray-600 text-4xl font-bold py-4">{post.title}</h1>
						<div className="tag">
							{tagsArray?.map((tag, index) => (
								<div key={index} className="text-gray-600 bg-blue-50 rounded-md px-4 py-2 mr-2 mb-2 inline-block">
									#{tag}
								</div>
							))}
						</div>

						<h2 className="text-gray-600 font-bold py-4 text-2xl">パーツ</h2>
						<div className="bg-white rounded-lg py-2">
							{post.part && (
								<ul className="space-y-4">
									<li className="flex items-center">
										<span className="font-semibold w-32">ケース:</span>
										<span>{post.part.case}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold w-32">プレート:</span>
										<span>{post.part.plate}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold w-32">スイッチ:</span>
										<span>{post.part.switches}</span>
									</li>
									<li className="flex items-center">
										<span className="font-semibold w-32">キーキャップ:</span>
										<span>{post.part.keyCaps}</span>
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
