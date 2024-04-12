// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import PostsCard from './components/PostsCard'
import { Post } from '../../types'

export default async function Home() {
	const postsPromise = prisma.post.findMany({
		orderBy: {
			createdat: 'desc'
		},
		include: {
			user: true
		}
	})

	const dummyPosts: Post[] = [
		{
			id: '1',
			title: 'ダミー1',
			description: 'ダミー',
			imageUrl: 'https://picsum.photos/id/237/200/300',
			videoUrl: 'https://www.youtube.com/watch?v=rydAjmwaOAE&pp=ygUQbGcgZHVhbHVwIGNvZGluZw%3D%3D',
			createdat: new Date(),
			updatedat: new Date(),
			user: {
				name: 'サンプル'
			}
		},
		{
			id: '2',
			title: 'ダミー2',
			description: 'ダミー',
			imageUrl: 'https://picsum.photos/id/237/100/300',
			videoUrl: 'https://www.youtube.com/watch?v=rydAjmwaOAE&pp=ygUQbGcgZHVhbHVwIGNvZGluZw%3D%3D',
			createdat: new Date(),
			updatedat: new Date(),
			user: {
				name: 'サンプル'
			}
		},
		{
			id: '3',
			title: 'ダミー3',
			description: 'ダミー',
			imageUrl: 'https://picsum.photos/id/237/200/300',
			videoUrl: 'https://www.youtube.com/watch?v=rydAjmwaOAE&pp=ygUQbGcgZHVhbHVwIGNvZGluZw%3D%3D',
			createdat: new Date(),
			updatedat: new Date(),
			user: {
				name: 'サンプル'
			}
		},
		{
			id: '4',
			title: 'ダミー4',
			description: 'ダミー',
			imageUrl: 'https://picsum.photos/id/237/100/300',
			videoUrl: 'https://www.youtube.com/watch?v=rydAjmwaOAE&pp=ygUQbGcgZHVhbHVwIGNvZGluZw%3D%3D',
			createdat: new Date(),
			updatedat: new Date(),
			user: {
				name: 'サンプル'
			}
		}
	]

	const [posts] = await Promise.all([postsPromise])

	const allPosts = [...posts, ...dummyPosts]

	return (
		<div className="bg-gray-900 text-cyan-400">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8">最新の投稿</h1>
				<PostsCard posts={allPosts} componentType="top" />
			</div>
		</div>
	)
}


