'use server'

import { prisma } from '@/app/lib/prisma'

export const postFromPrisma = async (postId: number) => {
	const post = await prisma.blog.findUnique({
		where: { id: postId }
	})

	return post
}
