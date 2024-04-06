import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
	try {
		// MEMO prismaでsupabase DBからすべてのユーザーを取得
		const users = await prisma.user.findMany()

		console.log(users)

		return Response.json({ users: users }, { status: 200 })

		// NextResponse.json()を使って、JSONレスポンスを返します。
		// return new NextResponse(JSON.stringify({ users }), {
		// 	status: 200,
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// })
	} catch (error) {
		console.error('ユーザーの取得に失敗しました:', error)

		return Response.json({ message: 'Not Found' }, { status: 500 })

		// エラー時のレスポンス
		// return new NextResponse(JSON.stringify({ error: 'ユーザーの取得に失敗しました' }), {
		// 	status: 500,
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// })
	}
}
