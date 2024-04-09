// src/app/page.tsx
import { prisma } from './lib/prisma'
import { formatDate, truncateDescription } from './func/postFunc'
import Link from 'next/link'

export default async function Home() {
	const posts = await prisma.post.findMany({
		orderBy: {
			createdat: 'desc'
		},
		include: {
			user: true
		}
	})

	return (
		<div className="bg-gray-900 text-cyan-400">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8">最新の投稿</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
					{posts.map((post) => (
						<Link href={`/post/${post.id}`}>
							<div key={post.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
								<div className="relative">
									{post.videoUrl ? (
										<video src={post.videoUrl} controls className="w-full h-48 md:h-64 object-cover" />
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
				</div>
			</div>
		</div>
	)
}
