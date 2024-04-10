// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import PostsCard from './components/PostsCard'
import { formatDate, truncateDescription } from './func/postFunc'

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
				<PostsCard posts={posts} componentType='top'/>
			</div>
		</div>
	)
}
