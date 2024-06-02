import React from 'react'
import Editor from '../newpost/page'
import { NextPage } from 'next'
import { postFromPrisma } from '@/app/actions/EditorFromPrismaPost/EditorFromPrismaPost'

interface PostData {
	id: number
	title: string
	content: string
	tags: string
	author: string
	postId: string | null
	createdAt: Date
	updatedAt: Date
}

async function fetchPostData(postId: number) {
	const postDBdata = await postFromPrisma(postId)
	return postDBdata
}

const PostEditor = async ({ params }: { params: { adminpostId: string } }) => {
	const postId = parseInt(params.adminpostId, 10)
	const postDBdata = await fetchPostData(postId)

	console.log('postDBdata', postDBdata)

	const formattedTags = Array.isArray(postDBdata?.tags) ? postDBdata.tags.join(', ') : postDBdata?.tags

	return (
		<>
			{postDBdata ? (
				<Editor
					initialTitle={postDBdata.title}
					initialContent={postDBdata.content}
					initialTags={formattedTags}
					postId={postDBdata.id}
				/>
			) : (
				<div>Loading...</div>
			)}
		</>
	)
}

export default PostEditor
