// /Users/ore/Documents/GitHub/keysound/src/app/actions/getBlogPost/getBlogPost.tsx

import { prisma } from '@/app/lib/prisma'

export default async function getBlogPosts() {
	return await prisma.blog.findMany({
		orderBy: { createdAt: 'desc' }
	})
}
