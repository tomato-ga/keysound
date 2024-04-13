// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import PostsCard from './components/PostsCard'
import { Post } from '../../types'

export default async function Home() {
	const posts = await prisma.post.findMany({
		orderBy: { createdat: 'desc' },
		include: { user: true }
	})

	return (
		<div className="bg-gray-900 text-cyan-400">
			<h1 className="text-4xl font-bold mb-8">最新の投稿</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
				<PostsCard posts={posts} componentType="top" />
			</div>
		</div>
	)
}
