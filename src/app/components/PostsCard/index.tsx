// PostsCard.tsx
import Link from 'next/link'
import { truncateDescription, formatDate } from '@/app/func/postFunc'
import { PostsProps } from '../../../../types'
import dynamic from 'next/dynamic'

const DynamicVideoPlayer = dynamic(() => import('../VideoPlayer'), {
	ssr: false
})

export default function PostsCard({ posts, componentType }: PostsProps) {
	return (
		<div className="bg-gray-900 min-h-screen pb-24">
			<div className="container mx-auto py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
					{componentType === 'top' && (
						<>
							{posts.map((post) => (
								<Link href={`/post/${post.id}`} key={post.id}>
									<div className="bg-gray-800 rounded-lg overflow-hidden">
										<div className="relative">
											{post.videoUrl ? (
												<DynamicVideoPlayer videoUrl={post.videoUrl} />
											) : (
												<img
													src={post.imageUrl || '/default-image.jpg'}
													alt={post.title}
													className="w-full h-48 md:h-64 object-cover"
												/>
											)}
											<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
												<h3 className="text-cyan-400 text-xl font-semibold">{post.title}</h3>
											</div>
										</div>
										<div className="p-6">
											<p className="text-gray-300 mb-4">{truncateDescription(post.description)}</p>
											<div className="flex justify-between items-center">
												<div className="flex items-center">
													<img
														src={post.user.image || '/default-avatar.jpg'}
														alt={post.user.name}
														className="w-8 h-8 rounded-full mr-2"
													/>
													<p className="text-cyan-400 font-semibold">{post.user.name}</p>
												</div>
												<p className="text-gray-500 text-sm">{formatDate(post.createdat)}</p>
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
								<div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden">
									<Link href={`/post/${post.id}`}>
										<div className="relative">
											{post.videoUrl ? (
												<DynamicVideoPlayer videoUrl={post.videoUrl} />
											) : (
												<img
													src={post.imageUrl || '/default-image.jpg'}
													alt={post.title}
													className="w-full h-48 md:h-64 object-cover"
												/>
											)}
											<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
												<h3 className="text-cyan-400 text-xl font-semibold">{post.title}</h3>
											</div>
										</div>
										<div className="p-6">
											<p className="text-gray-400 mb-4">{truncateDescription(post.description)}</p>
											<p className="text-gray-500 text-sm">{formatDate(post.updatedat)}</p>
										</div>
									</Link>
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
