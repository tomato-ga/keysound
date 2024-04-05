import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
	console.log('DB info: ', process.env.DATABASE_URL)

	try {
		const users = await prisma.user.findMany()
		// NextResponse.json()を使って、JSONレスポンスを返します。
		return new NextResponse(JSON.stringify({ users }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (error) {
		console.error('ユーザーの取得に失敗しました:', error)
		// エラー時のレスポンス
		return new NextResponse(JSON.stringify({ error: 'ユーザーの取得に失敗しました' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
}
