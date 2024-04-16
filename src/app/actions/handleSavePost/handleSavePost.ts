'use server'

import { prisma } from '@/app/lib/prisma'
import { PostFormData } from '../../../../types'

export const handleSavePost = async (formData: PostFormData, userEmail: string) => {
	try {
		if (!userEmail) {
			throw new Error('User email not found')
		}

		const user = await prisma.user.findUnique({
			where: { email: userEmail }
		})

		if (!user) {
			throw new Error('User not found')
		}

		const createdPost = await prisma.post.create({
			data: {
				userId: user.id,
				title: formData.title,
				description: formData.description,
				videoUrl: formData.videourl || null,
				tags: {
					create:
						formData.tags?.map((tagName) => ({
							tag: {
								connectOrCreate: {
									where: { name: tagName },
									create: { name: tagName }
								}
							}
						})) || []
				}
			},
			include: {
				tags: {
					include: {
						tag: true
					}
				}
			}
		})

		return createdPost.id
	} catch (error) {
		// エラー処理を追加
		console.error('Error creating post:', error)
		throw error
	}
}
