'use server'
import { prisma } from '@/app/lib/prisma'
import { PostEditFormData, UpdateParts } from '../../../../types'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'

// 型安全な取得用ユーティリティ関数
function getStringValue(formData: FormData, key: string): string | null {
	const value = formData.get(key)
	if (typeof value === 'string') {
		return value
	}
	return ''
}

export const handleUpdatePost = async (formData: FormData) => {
	console.log('受け取った formData:', formData)
	const id = getStringValue(formData, 'id')
	const title = getStringValue(formData, 'title')
	const description = getStringValue(formData, 'description')
	const updatedat = new Date()
	const category = getStringValue(formData, 'category')
	const screenName = getStringValue(formData, 'screenName')

	if (!id || !title) {
		console.error('必要なフィールドが不足しています', { title })
		throw new Error('必要なフィールドが不足しています')
	}

	if (category === 'undefined' || !category) {
		throw new Error('カテゴリIDが提供されていません。')
	}

	const postData: Omit<PostEditFormData, 'imageUrl' | 'videoUrl' | 'createdat' | 'user'> = {
		id,
		title,
		description: description ?? '',
		updatedat,
		part: parseUpdateParts(formData),
		category,
		screenName
		// tags: parseUpdateTags(formData)
	}

	try {
		console.log('データベースで投稿を更新中:', postData)
		const updatePost = await prisma.post.update({
			where: { id: postData.id },
			data: {
				title: postData.title,
				description: postData.description,
				updatedat: postData.updatedat,
				category: {
					connect: { id: postData.category }
				}
			}
		})
		console.log('投稿が正常に更新されました:', updatePost)

		if (postData.part) {
			console.log('投稿に関連するパーツを更新または作成中:', postData.part)
			await updatePartTable(postData.id, postData.part)
		}

		// console.log('投稿に関連するタグを更新中:', postData.tags)
		// await updateTagTable(postData.id, postData.tags)

		console.log('投稿の更新プロセスが成功しました postId:', id)
	} catch (error) {
		console.error('更新に失敗しました', error, { id })
		throw error
	}

	revalidateTag(`/post/${id}`)
	redirect(`/post/${id}`)
}

const parseUpdateParts = (formData: FormData): UpdateParts | null => {
	const caseData = formData.get('case') as string
	const plateData = formData.get('plate') as string
	const switchesData = formData.get('switches') as string
	const keyCapsData = formData.get('keyCaps') as string

	if (!caseData && !plateData && !switchesData && !keyCapsData) {
		return null
	}

	return {
		id: getStringValue(formData, 'partId') ?? '',
		postId: getStringValue(formData, 'id') ?? '',
		case: caseData || '',
		plate: plateData || '',
		switches: switchesData || '',
		keyCaps: keyCapsData || ''
	}
}

// const parseUpdateTags = (formData: FormData): UpdateTags\[\] => {
//   const tagData = getStringValue(formData, 'tags')
//   console.log('tagData', tagData) // タグデータをコンソールに出力
//   if (!tagData) {
//     return \[\]
//   }
//   return JSON.parse(tagData) as UpdateTags\[\]
// }

const updatePartTable = async (postId: string, partData: UpdateParts) => {
	try {
		const existingPart = await prisma.part.findFirst({
			where: { postId: postId }
		})
		console.log('既存のパーツのチェック:', existingPart)
		if (existingPart) {
			console.log('パーツが存在します。更新中...')
			await prisma.part.update({
				where: { postId: postId },
				data: {
					case: partData.case,
					plate: partData.plate,
					switches: partData.switches,
					keyCaps: partData.keyCaps
				}
			})
			console.log('パーツが正常に更新されました')
		} else {
			console.log('新しいパーツを作成中...')
			await prisma.part.create({
				data: {
					postId: postId,
					case: partData.case,
					plate: partData.plate,
					switches: partData.switches,
					keyCaps: partData.keyCaps
				}
			})
			console.log('パーツが正常に作成されました')
		}
	} catch (error) {
		console.error('パーツの更新中にエラーが発生しました:', error)
		throw error
	}
}
