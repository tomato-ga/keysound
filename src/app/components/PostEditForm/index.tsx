// /Users/ore/Documents/GitHub/keysound/src/app/components/PostEditForm/index.tsx
'use client'
import { prisma } from '@/app/lib/prisma'
import { Post, PostFormData, PostPart, UpdateParts, PostEditFormData } from '../../../../types'
import TitleInput from '../Upload/TitleInput'
import DescriptionInput from '../Upload/DescriptionInput'
import PartsInput from '../Upload/PartsInput'
import SaveButton from '../Upload/SaveButton'
import { useState, ChangeEvent } from 'react'
import DeletePostButton from '../DeletePostButton'
import { handleUpdatePost } from '@/app/actions/handleUpdatePost/handleUpdatePost'
import CategoryInput from '../Upload/CategoryInput'
import { deletePost } from '@/app/actions/deletePost/deletePost'
import { redirect } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../../../customtoast.css'

type NewType<T, Kind extends string> = T & {
	[key in `__${Kind}`]: never
}
type postId = NewType<string, 'Post'>

const PostEditForm: React.FC<{ post: PostEditFormData }> = ({ post }) => {
	console.log('post', post)

	const [postData, setPostData] = useState<PostEditFormData>({
		id: post.id,
		title: post.title,
		description: post.description,
		imageUrl: post.imageUrl,
		videoUrl: post.videoUrl ?? '',
		createdat: post.createdat,
		updatedat: post.updatedat,
		part: post.part || null,
		category: post.category || '',
		user: {
			id: post.user.id
		}
	})

	console.log('PostEditForm State', postData)

	const addPostIdhandleUpdatePost = handleUpdatePost.bind(null, postData.id)

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPostData((prevData) => ({ ...prevData, title: e.target.value }))
	}

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setPostData((prevData) => ({ ...prevData, description: e.target.value }))
	}

	const handlePartsChange = (parts: PostPart | UpdateParts | null) => {
		setPostData((prevData) => ({
			...prevData,
			part: parts as UpdateParts | null
		}))
	}

	const handleDeletePost = async () => {
		try {
			await deletePost(post.user.id, postData.id, postData.videoUrl)
			console.log('投稿を削除しました')
		} catch (error) {
			console.error(error)
		}
	}

	// TODO パーツが更新されない。updateしたら、updateatを表示する
	const handleFormSubmission = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!postData.title) {
			if (!postData.title) {
				toast.error('タイトルは必須です')
			}
		} else {
			const formData = new FormData()
			formData.append('title', postData.title)
			formData.append('description', postData.description)
			formData.append('category', postData.category)
			formData.append('partCase', postData.part?.case || '')
			formData.append('partPlate', postData.part?.plate || '')
			formData.append('partSwitches', postData.part?.switches || '')
			formData.append('partKeyCaps', postData.part?.keyCaps || '')

			await addPostIdhandleUpdatePost(formData)
		}
	}

	return (
		<div className="bg-white text-black min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white">
					<h1 className="text-4xl font-bold mb-8">投稿を編集する</h1>
					<form>
						<TitleInput title={postData.title} onTitleChange={handleTitleChange} />
						<DescriptionInput description={postData.description} onDescriptionChange={handleDescriptionChange} />

						<CategoryInput onCategoryChange={(category) => setPostData({ ...postData, category })} />

						<PartsInput parts={postData.part} onPartsChange={handlePartsChange} />

						<SaveButton type="submit" onClick={handleFormSubmission} />
					</form>
					<DeletePostButton onDeleteConfirmed={handleDeletePost} />
				</div>
			</div>
		</div>
	)
}

export default PostEditForm
