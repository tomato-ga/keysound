import { prisma } from '@/app/lib/prisma'

// 指定されたメールアドレスに一致するレコードがあるかどうかを確認する関数
export async function checkUserExists(email: string): Promise<boolean> {
	try {
		const user = await prisma.user.findUnique({
			where: { email }
		})
		return !!user // ユーザーが存在する場合はtrue、存在しない場合はfalse
	} catch (error) {
		console.error('データ取得エラー:', error)
		return false
	}
}
