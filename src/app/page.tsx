// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import { Post } from '../../types'

import TopPostsCard from './components/TopPostCard'
import { getScreenName } from './actions/getScreenName/getScreenName'

export default async function Home() {
	const posts = await prisma.post.findMany({
		orderBy: { createdat: 'desc' },
		include: {
			user: {
				include: {
					profile: true
				}
			}
		}
	})

	return (
		<div className="home">
			<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
				<TopPostsCard posts={posts} />
			</div>
		</div>
	)
}
