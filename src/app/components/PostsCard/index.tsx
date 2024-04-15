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
							<div className="bg-white rounded-lg overflow-hidden shadow m-2 md:m-2 lg:m-2 h-auto mx-auto">
								<div className="relative">{post.videoUrl && <DynamicVideoPlayer videoUrl={post.videoUrl} />}</div>
								<div className="px-4 py-6">
									<h3 className="text-black text-lg md:text-xl font-semibold mb-2">{post.title}</h3>
									<p className="text-gray-700 mb-2 md:mb-4 h-20 overflow-hidden text-ellipsis">{post.description}</p>
									<div className="flex justify-between items-center">
										<div className="flex items-center">
											<img
												src={post.user.image || '/default-avatar.jpg'}
												alt={post.user.name}
												className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
											/>
											<p className="text-gray-900 font-semibold">{post.user.name}</p>
										</div>
										<p className="text-gray-600 text-xs md:text-sm">{formatDate(post.createdat)}</p>
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
						<div key={post.id} className="bg-white rounded-lg overflow-hidden shadow">
							<Link href={`/post/${post.id}`}>
								<div className="relative">
									{post.videoUrl ? (
										<DynamicVideoPlayer videoUrl={post.videoUrl} />
									) : (
										<img
											src={post.imageUrl || '/default-image.jpg'}
											alt={post.title}
											className="w-full h-80 object-cover"
										/>
									)}
								</div>
								<div className="px-4 py-6">
									<h3 className="text-black text-lg md:text-xl font-semibold mb-2">{post.title}</h3>
									<p className="text-gray-700 mb-2 md:mb-4">{truncateDescription(post.description)}</p>
									<p className="text-gray-600 text-xs md:text-sm">{formatDate(post.updatedat)}</p>
								</div>
							</Link>
						</div>
					))}
				</>
			)}
		</>
	)
}
