// src/app/page.tsx
import { prisma } from './lib/prisma'


const formatDate = (date: Date) => {
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	return `${year}/${month}/${day} ${hours}:${minutes}`
}

const truncateDescription = (description: string, maxLength: number = 100) => {
	if (description.length <= maxLength) {
		return description
	}
	return description.slice(0, maxLength) + '...'
}

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
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">最新の投稿</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
				{posts.map((post) => (
					<div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
								<h3 className="text-white text-xl font-semibold">{post.title}</h3>
							</div>
						</div>
						<div className="p-6">
							<p className="text-gray-600 mb-4">{truncateDescription(post.description)}</p>
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<img
										src={post.user.image || '/default-avatar.jpg'}
										alt={post.user.name}
										className="w-8 h-8 rounded-full mr-2"
									/>
									<p className="text-gray-900 font-semibold">{post.user.name}</p>
								</div>
								<p className="text-gray-500 text-sm">{formatDate(post.createdat)}</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
