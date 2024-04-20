'use server'

import { prisma } from '@/app/lib/prisma'

export const getSuggestedTags = async (query: string): Promise<string[]> => {
	const suggestedTags = await prisma.tag.findMany({
		where: {
			name: {
				contains: query,
				mode: 'insensitive'
			}
		},
		select: {
			name: true
		}
	})

	return suggestedTags.map((tag) => tag.name)
}
