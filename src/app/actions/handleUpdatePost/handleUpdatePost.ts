'use server'
import { prisma } from '@/app/lib/prisma'
import { PostEditFormData, UpdateTags } from '../../../../types'

export const handleUpdatePost = async (formData: PostEditFormData) => {
	console.log('formData', formData)

	try {
		const updatePost = await prisma.post.update({
			where: {
				id: formData.id
			},
			data: {
				title: formData.title,
				description: formData.description,
				part: formData.part
					? {
							update: {
								case: formData.part.case,
								plate: formData.part.plate,
								switches: formData.part.switches,
								keyCaps: formData.part.keyCaps
							}
					  }
					: undefined,
				tags: {
					deleteMany: {}, // 既存のタグを削除する場合
					connectOrCreate: formData.tags.map((tag: UpdateTags) => ({
						where: { postId_tagId: { postId: formData.id, tagId: tag.tag.id } }, // 修正: 複合一意キーを使用
						create: {
							postId: formData.id,
							tagId: tag.tag.id,
							tag: {
								connect: { id: tag.tag.id }
							}
						}
					}))
				}
			}
		})

		console.log('Updated post:', updatePost)
	} catch (error) {
		console.error('handleUpdatePost error', error)
	}
}
