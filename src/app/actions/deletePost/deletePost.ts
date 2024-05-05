// deletePost.ts

'use server'

import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { handleRemoveVideo } from '../handleRemoveVideo/handleRemoveVideo'

export const deletePost = async (
	screenName: string | null | undefined,
	postId: string,
	videourl: string | null | undefined
) => {
	try {
		console.log('投稿削除プロセスの開始 postId:', postId)

		// 動画を削除
		const removeResult = await handleRemoveVideo(videourl)
		console.log('removeResult: ', removeResult)

		// 投稿に関連するパーツを削除
		await prisma.part.deleteMany({
			where: { postId: postId }
		})

		// 投稿を削除
		await prisma.post.delete({
			where: { id: postId }
		})

		console.log('投稿の削除プロセスが成功しました postId:', postId)
		// revalidatePath('/')
		// revalidateTag(`/profile/${userId}/postedit/${postId}`)
	} catch (error) {
		console.error('削除に失敗しました', error, { postId })
		throw error
	}
	revalidatePath(`/profile/${screenName}`)
}
