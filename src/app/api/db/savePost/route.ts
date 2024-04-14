// /Users/don/Codes/keysound/src/app/api/db/savePost/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface dbInsertPost {
	id: string
	title: string
	description: string
	imageurl?: string
	videourl?: string
	tags?: string[]
}

export async function POST(request: Request) {
	try {
		const postData: dbInsertPost = await request.json()
		console.log('postData', postData)

		// メールアドレスからユーザーを検索
		const user = await prisma.user.findUnique({
			where: { email: postData.id }
		})

		if (!user) {
			throw new Error('User not found')
		}

		console.log('userID:', user.id)

		const createdPost = await prisma.post.create({
			data: {
				userId: user.id,
				title: postData.title,
				description: postData.description,
				imageUrl: postData.imageurl || null,
				videoUrl: postData.videourl || null,
				tags: {
					create:
						postData.tags?.map((tagName) => ({
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

		console.log('Post created:', JSON.stringify(createdPost, null, 2))
		return NextResponse.json({ message: 'Post created successfully', res: createdPost })
	} catch (error) {
		console.error('Error creating post:', error)
		return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
	}
}
