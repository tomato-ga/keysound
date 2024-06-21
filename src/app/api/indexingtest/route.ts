import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
	try {
		// Blog テーブルからデータを取得
		const blogs = await prisma.blog.findMany({
			select: { id: true }
		})

		// Post テーブルからデータを取得
		const posts = await prisma.post.findMany({
			select: { id: true }
		})

		// 取得したデータをレスポンスとして返す
		return NextResponse.json({ blogs, posts })
	} catch (error) {
		console.error('Error occurred:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
