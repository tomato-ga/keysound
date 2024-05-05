// dbUserInsert.ts

'use server'

import { prisma } from '@/app/lib/prisma' // prismaインスタンスのインポートを確認

export async function insertUserData(name: string, email: string, image: string): Promise<{ userExists: boolean }> {
	try {
		// ユーザーの存在チェック
		const existingUser = await prisma.user.findUnique({
			where: { email }
		})

		if (!existingUser) {
			// ユーザーが存在しない場合は新規作成
			const user = await prisma.user.create({
				data: {
					name,
					email,
					image,
					profile: {
						create: {
							screenName: name // screenNameをnameと同じ値に設定
						}
					}
				},
				include: {
					profile: true // 作成されたProfileも取得
				}
			})

			return { userExists: false }
		} else {
			// ユーザーが既に存在する場合
			return { userExists: true }
		}
	} catch (error) {
		console.error('データ挿入時のエラー:', error)
		throw error
	}
}

// export async function insertUserData(
// 	name: string,
// 	email: string,
// 	image?: string,
// ): Promise<{ userExists: boolean }> {
// 	try {
// 		const response = await fetch("/api/db/userSave", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({ name, email, image }),
// 		});
// 		if (response.ok) {
// 			const data = await response.json();
// 			console.log(data.message);
// 			return { userExists: false };
// 		} else if (response.status === 400) {
// 			return { userExists: true };
// 		} else {
// 			throw new Error("Failed to insert user data");
// 		}
// 	} catch (error) {
// 		console.error("データ挿入時のエラー:", error);
// 		throw error;
// 	}
// }
