import Link from 'next/link'
import { truncateDescription, formatDate } from '@/app/func/postFunc'
import { TopPostsProps } from '../../../../types'
import dynamic from 'next/dynamic'
import PostOptionsButton from '../PostOptionButton'

const DynamicVideoPlayer = dynamic(() => import('../VideoPlayer'), {
	ssr: false
})

export default function TopPostsCard({ posts }: TopPostsProps) {
	console.log('posts', posts)

	return (
		<>
			{posts.map((post) => (
				<div className="mt-2" key={post.id}>
					<Link href={`/post/${post.id}`}>
						<div className="bg-white rounded-lg overflow-hidden shadow m-2 md:m-2 lg:m-2 mx-auto h-full flex flex-col justify-between">
							<div>
								<div className="relative aspect-w-16 aspect-h-9">
									{post.videoUrl && <DynamicVideoPlayer videoUrl={post.videoUrl} loop={true} />}
									{!post.videoUrl && post.youtube && <DynamicVideoPlayer videoUrl={post.youtube} loop={true} />}
								</div>
								<div className="px-4 py-8">
									<h3 className="text-black text-lg md:text-xl font-semibold mb-2">{post.title}</h3>
									<p className="text-gray-700 mb-2 md:mb-4 overflow-hidden">
										{truncateDescription(post.description, 140)}
									</p>
								</div>
							</div>
							<div className="px-4 py-4">
								<div className="flex justify-between items-center">
									<div className="flex items-center">
										<img
											src={post.user.image || '/default-avatar.jpg'}
											className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
										/>
										<p className="text-gray-900 font-semibold">{post.user.profile?.screenName}</p>
									</div>
									<p className="text-gray-600 text-xs md:text-sm">{formatDate(post.createdat)}</p>
								</div>
							</div>
						</div>
					</Link>
				</div>
			))}
		</>
	)
}
