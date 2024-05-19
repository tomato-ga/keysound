import React, { useEffect } from 'react'
import { prisma } from '@/app/lib/prisma'
import { formatDate } from '@/app/func/postFunc'
import dynamic from 'next/dynamic'
import { profile } from 'console'
import { getScreenName } from '@/app/actions/getScreenName/getScreenName'
import PostOptionsButton from '@/app/components/PostOptionButton'

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
			user: { include: { profile: true } },
			part: true
		}
	})

	console.log('post prisma', post)

	const name = await getScreenName()
	const isCurrentUser = post?.user.profile?.screenName === name

	const linkifyText = (text: string) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g
		return text.split(urlRegex).map((part, index) => {
			if (part.match(urlRegex)) {
				return (
					<a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
						{part}
					</a>
				)
			}
			return part
		})
	}

	if (!post) {
		return <div>Post not found</div>
	}

	const videoUrl = post.videoUrl || post.youtube

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white">
					<div className="relative">{videoUrl && <DynamicVideoPlayer videoUrl={videoUrl} controls={true} />}</div>
					<div className="p-8">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center">
								<img
									src={post.user.image || '/default-avatar.jpg'}
									alt={post.user.profile?.screenName ?? 'スクリーンネームがありません'}
									className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
								/>
								<div>
									<p className="text-gray-900 font-semibold">{post.user.profile?.screenName}</p>
									{post.updatedat ? (
										<p className="text-gray-600 text-sm">{formatDate(post.updatedat)}</p>
									) : (
										<p className="text-gray-600 text-sm">{formatDate(post.createdat)}</p>
									)}
								</div>
							</div>
							{isCurrentUser && (
								<div className="relative">
									<PostOptionsButton postId={post.id} screenName={post.user.profile?.screenName} />
								</div>
							)}
						</div>
						<h1 className="text-gray-600 text-2xl sm:text-4xl font-bold py-4">{post.title}</h1>
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
						<p className="text-gray-600 leading-relaxed mb-8 py-4 whitespace-pre-wrap break-words">
							{linkifyText(post.description)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostPage
