// dbUserInsert.ts

'use server'

import { prisma } from '@/app/lib/prisma' // prismaインスタンスのインポートを確認
import { User } from '../../../../types'

// TODO API経由でfetchしてキャッシュさせる
export async function insertUserData(name: string, email: string, image: string) {
	try {
		// ユーザーの存在チェック
		const existingUser = await prisma.user.findUnique({
			where: { email },
			include: { profile: true } // 関連する Profile も取得
		})

		console.log('existingUser', existingUser)

		if (!existingUser) {
			// ユーザーが存在しない場合は新規作成
			const user = await prisma.user.create({
				data: {
					name,
					email,
					image,
					profile: {
						create: {
							bio: '',
							screenName: name // screenName をname と同じ値に設定
							// その他のデフォルト値を設定
						}
					}
				},
				include: {
					profile: true // 作成された Profile も取得
				}
			})

			console.log('user', user)

			return { userExists: false, username: user.name }
		} else {
			// ユーザーが既に存在する場合
			return { userExists: true, user: existingUser }
		}
	} catch (error) {
		console.error('データ挿入時のエラー:', error)
		throw error
	}
}
