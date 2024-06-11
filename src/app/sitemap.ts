import { MetadataRoute } from 'next'
import { prisma } from './lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const blogs = await prisma.blog.findMany({
		select: {
			id: true,
			updatedAt: true
		}
	})

	const posts = await prisma.post.findMany({
		select: {
			id: true,
			updatedat: true // 'updatedat' のままに修正
		}
	})

	const blogSitemap = blogs.map((blog) => ({
		url: `https://keyboard-sound.net/blogpost/${blog.id}`,
		lastModified: blog.updatedAt,
		changeFrequency: 'weekly' as const, // 型を明示
		priority: 0.5
	}))

	const postSitemap = posts.map((post) => ({
		url: `https://keyboard-sound.net/post/${post.id}`,
		lastModified: post.updatedat,
		changeFrequency: 'weekly' as const, // 型を明示
		priority: 0.5
	}))

	return [...blogSitemap, ...postSitemap]
}
