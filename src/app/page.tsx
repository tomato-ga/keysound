// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import { Post } from '../../types'

import TopPostsCard from './components/TopPostCard'
import { getScreenName } from './actions/getScreenName/getScreenName'
import { Metadata } from 'next'
import TopCopy from './components/Copy/index'
import { aboutstring, openGraphImage, twitterImage } from './func/aboutdescription'

export const metadata: Metadata = {
	title: 'keyboard sound',
	description: aboutstring,
	openGraph: {
		title: 'keyboard sound',
		description: aboutstring,
		images: [
			{
				url: openGraphImage,
				width: 1280,
				height: 720,
				alt: 'Open Graph Image'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'keyboard sound',
		description: aboutstring,
		images: [
			{
				url: twitterImage, // ここで画像のパスを指定
				width: 1280,
				height: 720,
				alt: 'Twitter Image'
			}
		]
	}
}

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
			{/* <TopCopy /> */}
			<div className="flex flex-col md:flex-row min-h-screen bg-white">
				{/* メインコンテンツ */}
				<div className="flex-1 p-2 bg-white">
					<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
						<TopPostsCard posts={posts} />
					</div>
				</div>
			</div>
		</div>
	)
}
