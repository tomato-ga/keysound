'use server'
import { prisma } from '@/app/lib/prisma'
import { PostFormData } from '../../../../types'

export const handleSavePost = async (formData: PostFormData, userEmail: string) => {
	console.log('formData', formData)

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
				title: formData.title,
				description: formData.description,
				videoUrl: formData.videourl || null,
				youtube: formData.youtube || null, // ここでYouTube URLを追加
				thumbnail: formData.thumbnail || null,
				part: {
					create: {
						case: formData.parts[0]?.case || '',
						plate: formData.parts[0]?.plate || '',
						switches: formData.parts[0]?.switches || '',
						keyCaps: formData.parts[0]?.keyCaps || ''
					}
				},
				...(formData.category && { category: { connect: { id: formData.category } } }),
				user: { connect: { id: user.id } }
			},
			include: { part: true, category: true }
		})

		console.log('createdPost', createdPost)
		console.log('createdPost.part', createdPost.part)

		return createdPost.id
	} catch (error) {
		console.error('Error creating post:', error)
		throw error
	}
}
