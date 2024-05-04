import Link from 'next/link'
import { truncateDescription, formatDate } from '@/app/func/postFunc'
import { ProfilePostsProps } from '../../../../types'
import dynamic from 'next/dynamic'
import PostOptionsButton from '../PostOptionButton'
const DynamicVideoPlayer = dynamic(() => import('../VideoPlayer'), { ssr: false })

export default function ProfilePostsCard({ posts, isCurrentUser, screenName }: ProfilePostsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{posts.map((post) => (
				<div key={post.id} className="bg-white rounded-lg overflow-hidden shadow mb-8">
					<Link href={`/post/${post.id}`}>
						<div className="relative aspect-w-16 aspect-h-9">
							{post.videoUrl ? (
								<DynamicVideoPlayer videoUrl={post.videoUrl} loop={true} />
							) : (
								<img src={post.imageUrl || ''} alt={post.title} className="w-full h-full object-cover" />
							)}
						</div>
					</Link>
					<div className="px-4 py-6 relative">
						<Link href={`/post/${post.id}`}>
							<h3 className="text-black text-lg md:text-xl font-semibold mb-2">{post.title}</h3>
							<p className="text-gray-700 mb-2 md:mb-4 h-20 overflow-hidden text-ellipsis">
								{truncateDescription(post.description, 80)}
							</p>
							<p className="text-gray-600 text-xs md:text-sm">{formatDate(post.updatedat)}</p>
						</Link>
						{isCurrentUser && (
							<div className="absolute top-2 right-2">
								<PostOptionsButton postId={post.id} screenName={screenName} />
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	)
}
