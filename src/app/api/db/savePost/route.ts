import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface postDBinsert {
	id: string
	title: string
	description: string
	imageurl?: string
	videourl?: string
	tags?: string[]
}

export async function POST(request: Request) {
	try {
		const postData: postDBinsert = await request.json()
		console.log('postData', postData)

		const createdPost = await prisma.post.create({
			data: {
				userId: postData.id,
				title: postData.title,
				description: postData.description,
				imageUrl: postData.imageurl || null,
				videoUrl: postData.videourl || null,
				tags: {
					connectOrCreate:
						postData.tags?.map((tagName) => ({
							where: { name: tagName },
							create: { name: tagName }
						})) || []
				}
			}
		})

		console.log('Post created:', createdPost)
		return NextResponse.json({ message: 'Post created successfully' })
	} catch (error) {
		console.error('Error creating post:', error)
		return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
	}
}
