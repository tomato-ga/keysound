/* This code snippet is a TypeScript React component named `PostsCard` that renders a list of posts
based on the `componentType` prop. */
// PostsCard.tsx
import Link from 'next/link'
import { truncateDescription, formatDate } from '@/app/func/postFunc'
import { PostsProps } from '../../../../types'
import dynamic from 'next/dynamic'

const DynamicVideoPlayer = dynamic(() => import('../VideoPlayer'), { ssr: false })

export default function PostsCard({ posts, componentType }: PostsProps) {
	return (
		<>
			{componentType === 'top' && (
				<>
					{posts.map((post) => (
						<Link href={`/post/${post.id}`} key={post.id}>
							<div className="bg-[#141921] rounded-lg overflow-hidden m-2 md:m-3 lg:m-4">
								<div className="relative">
									{post.videoUrl && <DynamicVideoPlayer videoUrl={post.videoUrl} />}
									<div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black to-transparent">
										<h3 className="text-cyan-400 text-lg md:text-xl font-semibold">{post.title}</h3>
									</div>
								</div>
								<div className="px-4 py-6">
									<p className="text-gray-300 mb-2 md:mb-4">{truncateDescription(post.description)}</p>
									<div className="flex justify-between items-center">
										<div className="flex items-center">
											<img
												src={post.user.image || '/default-avatar.jpg'}
												alt={post.user.name}
												className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
											/>
											<p className="text-cyan-400 font-semibold">{post.user.name}</p>
										</div>
										<p className="text-gray-500 text-xs md:text-sm">{formatDate(post.createdat)}</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</>
			)}

			{componentType === 'profile' && (
				<>
					{posts.map((post) => (
						<div key={post.id} className="bg-[#141921] rounded-lg overflow-hidden">
							<Link href={`/post/${post.id}`}>
								<div className="relative">
									{post.videoUrl ? (
										<DynamicVideoPlayer videoUrl={post.videoUrl} />
									) : (
										<img
											src={post.imageUrl || '/default-image.jpg'}
											alt={post.title}
											className="w-full h-48 object-cover"
										/>
									)}
									<div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black to-transparent">
										<h3 className="text-cyan-400 text-lg md:text-xl font-semibold">{post.title}</h3>
									</div>
								</div>
								<div className="px-4 py-6">
									<p className="text-gray-400 mb-2 md:mb-4">{truncateDescription(post.description)}</p>
									<p className="text-gray-500 text-xs md:text-sm">{formatDate(post.updatedat)}</p>
								</div>
							</Link>
						</div>
					))}
				</>
			)}
		</>
	)
}
