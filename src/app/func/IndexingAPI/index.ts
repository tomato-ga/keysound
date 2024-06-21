import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
	try {
		// Blog テーブルからデータを取得
		const blogs = await prisma.blog.findMany({
			select: { id: true }
		})

		let blogUrls = blogs.map((blog) => `https://keyboard-sound.net/blogpost/${blog.id}`)

		// Post テーブルからデータを取得
		const posts = await prisma.post.findMany({
			select: { id: true }
		})

		let postUrls = posts.map((post) => `https://keyboard-sound.net/post/${post.id}`)

		// すべてのURLを結合
		const urls = [...blogUrls, ...postUrls]

		// Google Indexing APIに登録
		const indexingResponses = await Promise.all(
			urls.map(async (url) => {
				try {
					const response = await axios.post(
						'https://indexing.googleapis.com/v3/urlNotifications:publish',
						{
							url: url,
							type: 'URL_UPDATED'
						},
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer YOUR_ACCESS_TOKEN`
							}
						}
					)
					return response.status === 200
				} catch (error) {
					console.error(`Failed to index URL: ${url}`, error)
					return false
				}
			})
		)

		if (indexingResponses.every((response) => response)) {
			return NextResponse.json({ message: 'All URLs successfully indexed' })
		} else {
			return NextResponse.json({ message: 'Some URLs failed to index' }, { status: 500 })
		}
	} catch (error) {
		console.error('Error occurred:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
