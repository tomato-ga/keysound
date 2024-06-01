// src/app/page.tsx
import Link from 'next/link'
import { prisma } from './lib/prisma'
import { Post } from '../../types'

import TopPostsCard from './components/TopPostCard'
import { getScreenName } from './actions/getScreenName/getScreenName'
import { Metadata } from 'next'
import TopCopy from './components/Copy/index'

export const metadata: Metadata = {
	title: 'keyboard sound',
	description:
		'keyboard soundは、キーボードの「打鍵音」に特化した、ニッチな場所を目指しています。 自分のお気に入りキーボードの打鍵音を投稿したり、他の人の投稿を探索したりできるようになる予定です。 ぜひみなさんのキーボードの音を聞かせてください。',
	openGraph: {
		title: 'keyboard sound',
		description:
			'keyboard soundは、キーボードの「打鍵音」に特化した、ニッチな場所を目指しています。 自分のお気に入りキーボードの打鍵音を投稿したり、他の人の投稿を探索したりできるようになる予定です。 ぜひみなさんのキーボードの音を聞かせてください。',
		images: [
			{
				url: 'https://keyboard-sound.net/opengraph-image.jpg', // ここで画像のパスを指定
				width: 1280,
				height: 720,
				alt: 'Open Graph Image'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'keyboard sound',
		description:
			'keyboard soundは、キーボードの「打鍵音」に特化した、ニッチな場所を目指しています。 自分のお気に入りキーボードの打鍵音を投稿したり、他の人の投稿を探索したりできるようになる予定です。 ぜひみなさんのキーボードの音を聞かせてください。',
		images: [
			{
				url: 'https://keyboard-sound.net/twitter-image.jpg', // ここで画像のパスを指定
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
