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
		<div className="home">
			<h1 className="text-4xl font-bold mb-8">最新の投稿</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				<PostsCard posts={posts} componentType="top" />
			</div>
		</div>
	)
}
