import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { google } from 'googleapis'
import { prisma } from '@/app/lib/prisma'

async function notifyIndexing(urls: string[]) {
	const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
	const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

	if (!clientEmail || !privateKey) {
		throw new Error('Google client email or private key is not defined in environment variables')
	}

	const jwtClient = new google.auth.JWT(clientEmail, undefined, privateKey, [
		'https://www.googleapis.com/auth/indexing'
	])

	try {
		const tokens = await jwtClient.authorize()

		for (const url of urls) {
			const options = {
				url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokens.access_token}`
				},
				data: {
					url: url,
					type: 'URL_UPDATED'
				}
			}
			const response = await axios(options)
			console.log(response.data)
			console.log('Indexing completed for URL:', url)
		}
	} catch (err) {
		console.error('Error notifying indexing:', err)
	}
}

export async function GET(req: NextRequest) {
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

		// Indexing APIに通知
		await notifyIndexing(urls)

		return NextResponse.json({ message: 'Indexing request sent' })
	} catch (error) {
		console.error('Error occurred:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
