// deletePost.ts

'use server'

import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'

export const deletePost = async (userId: string, postId: string) => {
	try {
		console.log('投稿削除プロセスの開始 postId:', postId)

		// 投稿に関連するパーツを削除
		await prisma.part.deleteMany({
			where: { postId: postId }
		})

		// 投稿を削除
		await prisma.post.delete({
			where: { id: postId }
		})

		// TODO 投稿を削除したら、動画も削除する

		console.log('投稿の削除プロセスが成功しました postId:', postId)
		// revalidatePath('/')
		// revalidateTag(`/profile/${userId}/postedit/${postId}`)
		revalidatePath(`/profile/${userId}/postedit/${postId}`)
		redirect('/profile')
	} catch (error) {
		console.error('削除に失敗しました', error, { postId })
		throw error
	}
}
