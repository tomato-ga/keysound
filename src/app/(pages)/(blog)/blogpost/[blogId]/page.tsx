// /Users/ore/Documents/GitHub/keysound/src/app/(pages)/(blog)/blogpost/[blogId]/page.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import MarkdownContent from '@/app/components/Markdowncontent'
import { prisma } from '@/app/lib/prisma'

interface BlogPostProps {
	params: { blogId: string }
}

const fetchPost = async (blogId: string) => {
	const postId = Number(blogId) // stringからnumberに変換

	if (isNaN(postId)) {
		throw new Error('Invalid post ID')
	}

	const post = await prisma.blog.findUnique({
		where: { id: postId }
	})

	if (!post) {
		throw new Error('Post not found')
	}

	return {
		id: post.id,
		title: post.title,
		content: post.content,
		created_at: post.createdAt.toISOString(),
		tags: post.tags
	}
}

const BlogPost: React.FC<BlogPostProps> = async ({ params }) => {
	console.log('post:', params.blogId)

	const post = await fetchPost(params.blogId)

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	const extractAsin = (value: string) => {
		if (!value) {
			return ''
		}
		return value.replace('ASIN#', '')
	}

	return (
		<>
			<div className="max-w-screen-md mx-auto">
				<div className="flex justify-center items-center m-6 text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text border-solid border-b border-gray-200 pb-4">
						{post.title}
					</h1>
				</div>

				<div className="m-6">
					<MarkdownContent markdownString={post.content} />
				</div>

				{/* <h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">最新セール情報</h2> */}
				<div className="h-0.5 bg-gradient-to-r from-[#d299c2] to-[#fef9d7] ml-10 mr-10"></div>
				<div className="flex flex-col md:flex-row bg-white p-4"></div>
			</div>
		</>
	)
}

export default BlogPost
