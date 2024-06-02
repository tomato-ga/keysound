'use server'

import { prisma } from '@/app/lib/prisma'

export const saveArticle = async (title: string, content: string, tags: string[], author: string) => {
	console.log('saveArticle called with:', { title, content, tags, author })
	try {
		const newArticle = await prisma.blog.create({
			data: {
				title,
				content,
				tags: tags.join(','),
				author
			}
		})
		console.log('New article created:', newArticle)
		return newArticle
	} catch (error) {
		console.error('Error saving article: ', error)
		throw error
	}
}
