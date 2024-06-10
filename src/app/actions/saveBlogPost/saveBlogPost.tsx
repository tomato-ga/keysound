'use server'

import { prisma } from '@/app/lib/prisma'

export const saveArticle = async (
	title: string,
	content: string,
	tags: string[],
	author: string,
	thumb_url: string
) => {
	console.log('saveArticleが呼び出されました:', { title, content, tags, author, thumb_url })
	try {
		const newArticle = await prisma.blog.create({
			data: {
				title,
				content,
				tags: tags.join(','),
				author,
				thumb_url
			}
		})
		console.log('新しい記事が作成されました:', newArticle)
		return newArticle
	} catch (error) {
		console.error('記事の保存中にエラーが発生しました:', error)
		throw error
	}
}

export const saveUpdateArticle = async (
	title: string,
	content: string,
	tags: string[],
	author: string,
	thumb_url: string,
	postId: number
) => {
	try {
		const updatedArticle = await prisma.blog.update({
			where: { id: postId },
			data: {
				title,
				content,
				tags: tags.join(','),
				author,
				thumb_url
			}
		})
		console.log('記事が更新されました:', updatedArticle)
		return updatedArticle
	} catch (error) {
		console.error('記事の更新中にエラーが発生しました:', error)
		throw error
	}
}
