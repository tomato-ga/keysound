// Route Handler
import { prisma } from '@/app/lib/prisma'
import { NextRequest } from 'next/server'
import { cache } from 'react'

export const POST = cache(async (req: NextRequest) => {
	const body = await req.json()
	console.log('API呼び出し:', body)

	if (req.method === 'POST') {
		const { name, email } = body

		try {
			// ユーザーの存在チェック
			const existingUser = await prisma.user.findUnique({
				where: { email }
			})

			if (!existingUser) {
				// ユーザーが存在しない場合は新規作成
				const user = await prisma.user.create({
					data: { name, email }
				})
				return Response.json({ message: 'DB保存成功', user }, { status: 200 })
			} else {
				// ユーザーが既に存在する場合
				return Response.json({ message: 'ユーザーは既に存在します' }, { status: 400 })
			}
		} catch (error) {
			console.error('エラー:', error)
			return Response.json({ message: 'サーバーエラー', error }, { status: 500 })
		}
	}
})
