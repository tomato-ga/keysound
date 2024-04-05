// /api/db/userSave/route.ts

import { NextApiRequest } from 'next'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server' // NextResponseをインポート

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
	const body = await req.json() //MEMO req.jsonで読み込めた
	console.log('API呼び出し:', body)

	if (req.method === 'POST') {
		const { name, email } = body // req.bodyがすでにJSONであれば、このパースは不要です

		try {
			const user = await prisma.user.create({
				data: {
					name,
					email
				}
			})

			// 成功レスポンスをNextResponseを使用して返す
			return new NextResponse(JSON.stringify(user), {
				status: 200, // ステータスコードを設定
				headers: {
					'Content-Type': 'application/json' // ヘッダーを設定
				}
			})
		} catch (error) {
			console.error(error)
			// エラーレスポンスをNextResponseを使用して返す
			return new NextResponse(JSON.stringify({ error: 'Failed to insert user' }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			})
		}
	} else {
		// メソッド不許可のレスポンスをNextResponseを使用して返す
		return new NextResponse('Method Not Allowed', {
			status: 405,
			headers: {
				Allow: 'POST' // 許可されているメソッドを指定
			}
		})
	}
}
