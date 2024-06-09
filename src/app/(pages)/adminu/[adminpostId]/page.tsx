'use client'

import React, { useState, useEffect } from 'react'
import Editor from '../newpost/page'
import { NextPage } from 'next'
import { postFromPrisma } from '@/app/actions/EditorFromPrismaPost/EditorFromPrismaPost'
import { saveUpdateArticle } from '@/app/actions/saveBlogPost/saveBlogPost'

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

async function fetchPostData(postId: number): Promise<PostData | null> {
	try {
		const postDBdata = await postFromPrisma(postId)
		return postDBdata
	} catch (error) {
		console.error('Error fetching post data:', error)
		return null
	}
}

const PostEditor: NextPage<{ params: { adminpostId: string } }> = ({ params }) => {
	const postId = parseInt(params.adminpostId, 10)
	const [postDBdata, setPostDBdata] = useState<PostData | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getPostData = async () => {
			const data = await fetchPostData(postId)
			setPostDBdata(data)
			setLoading(false)
		}

		getPostData()
	}, [postId])

	const handleSave = async (data: {
		title: string
		content: string
		tags: string[]
		postId?: number | null
		thumb_url: string
	}) => {
		try {
			if (data.postId) {
				await saveUpdateArticle(data.title, data.content, data.tags, 'dondonbe', data.thumb_url, data.postId)
				console.log('Article updated successfully')
			}
		} catch (error) {
			console.error('Error updating article:', error)
		}
	}

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<>
			{postDBdata ? (
				<Editor
					initialTitle={postDBdata.title}
					initialContent={postDBdata.content}
					initialTags={postDBdata.tags}
					postId={postDBdata.id}
					onSave={handleSave}
				/>
			) : (
				<div>Post not found</div>
			)}
		</>
	)
}

export default PostEditor
