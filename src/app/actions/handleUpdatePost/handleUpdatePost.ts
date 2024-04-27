'use server'

import { prisma } from '@/app/lib/prisma'
import { PostEditFormData, UpdateParts, UpdateTags } from '../../../../types'

// 型安全な取得用ユーティリティ関数
function getStringValue(formData: FormData, key: string): string | undefined {
	const value = formData.get(key)
	if (typeof value === 'string') {
		return value
	}
	return undefined
}

export const handleUpdatePost = async (postId: string, formData: FormData) => {
	console.log('formData', formData)
	console.log(postId)

	const id = postId
	const title = getStringValue(formData, 'title')
	const description = getStringValue(formData, 'description')

	// updatedatStr が formData から取得できない場合、常に現在の日時を使用
	const updatedat = new Date()

	console.log('const値', id, title, description)

	if (!id || !title || !description) {
		throw new Error('Missing required fields')
	}

	const postData: Omit<PostEditFormData, 'imageUrl' | 'videoUrl' | 'createdat'> = {
		id,
		title,
		description,
		updatedat, // 直接 Date オブジェクトを使用
		part: parseUpdateParts(formData),
		tags: parseUpdateTags(formData)
	}

	try {
		await prisma.$transaction(async (prisma) => {
			const updatePost = await prisma.post.update({
				where: { id: postData.id },
				data: {
					title: postData.title,
					description: postData.description,
					updatedat: postData.updatedat
				}
			})

			console.log('Updated post:', updatePost)

			if (postData.part) {
				await updatePartTable(postData.part)
			}

			await updateTagTable(postData.id, postData.tags)
		})

		console.log('Update successful')
	} catch (error) {
		console.error('Update failed', error)
		throw error
	}
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

const parseUpdateTags = (formData: FormData): UpdateTags[] => {
	const tagData = getStringValue(formData, 'tags')
	if (!tagData) {
		return []
	}
	return JSON.parse(tagData) as UpdateTags[]
}

// TODO partテーブルが存在しない場合は新たに作成する
const updatePartTable = async (partData: UpdateParts) => {
	try {
		await prisma.part.update({
			where: { postId: partData.postId },
			data: {
				case: partData.case,
				plate: partData.plate,
				switches: partData.switches,
				keyCaps: partData.keyCaps
			}
		})
	} catch (error) {
		console.error('updatePartTable error', error)
		throw error
	}
}

const updateTagTable = async (postId: string, tags: UpdateTags[] | string[]) => {
	try {
		await prisma.postTag.deleteMany({
			where: { postId }
		})

		for (const tag of tags) {
			if (typeof tag === 'string') {
				await prisma.postTag.create({
					data: {
						post: { connect: { id: postId } },
						tag: { connectOrCreate: { where: { name: tag }, create: { name: tag } } }
					}
				})
			} else {
				await prisma.postTag.create({
					data: {
						post: { connect: { id: postId } },
						tag: { connect: { id: tag.tagId } }
					}
				})
			}
		}
	} catch (error) {
		console.error('updateTagTable error', error)
		throw error
	}
}
