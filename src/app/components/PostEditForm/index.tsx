// /Users/ore/Documents/GitHub/keysound/src/app/components/PostEditForm/index.tsx
'use client'
import { prisma } from '@/app/lib/prisma'
import { Post, PostFormData, PostPart, UpdateTags, UpdateParts, PostEditFormData } from '../../../../types'
import TitleInput from '../Upload/TitleInput'
import DescriptionInput from '../Upload/DescriptionInput'
import PartsInput from '../Upload/PartsInput'
import TagInput from '../Upload/Taginput'
import FileUploadButton from '../Upload/FileUploadButton'
import SaveButton from '../Upload/SaveButton'
import PreviewSection from '../Upload/PreviewSection'
import { useState, ChangeEvent } from 'react'
import DeletePostButton from '../DeletePostButton'
import { handleUpdatePost } from '@/app/actions/handleUpdatePost/handleUpdatePost'
import CategoryInput from '../Upload/CategoryInput'

type NewType<T, Kind extends string> = T & {
	[key in `__${Kind}`]: never
}
type postId = NewType<string, 'Post'>

const PostEditForm: React.FC<{ post: PostEditFormData }> = ({ post }) => {
	const [postData, setPostData] = useState<PostEditFormData>({
		id: post.id,
		title: post.title,
		description: post.description,
		imageUrl: post.imageUrl,
		videoUrl: post.videoUrl ?? '',
		createdat: post.createdat,
		updatedat: post.updatedat,
		part: post.part,
		category: post.category
		// tags: post.tags
	})

	console.log('PostEditForm State', postData)

	const addPostIdhandleUpdatePost = handleUpdatePost.bind(null, postData.id)

	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault()
	// 	try {
	// 		const updatedPostData: PostEditFormData = {
	// 			...postData,
	// 			tags: postData.tags
	// 		}
	// 		console.log('Updated postData data:', updatedPostData)

	// 		// TODO 動画を削除できるようにする？
	// 	} catch (error) {
	// 		console.error('Error updating post:', error)
	// 	}
	// }

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

	const handleTagsChange = (tags: (string | UpdateTags)[]) => {
		const updateTags: UpdateTags[] = tags.map((tag) => {
			if (typeof tag === 'string') {
				return { tag: { id: '', name: tag }, postId: postData.id, tagId: '' }
			} else {
				return tag
			}
		})
		setPostData((prevData) => ({
			...prevData,
			tags: updateTags
		}))
	}

	const handleDeletePost = async () => {
		try {
			// TODO ServerAction実装する
			console.log('投稿を削除しました')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="bg-white text-black min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white">
					<h1 className="text-4xl font-bold mb-8">投稿を編集する</h1>
					<form action={addPostIdhandleUpdatePost}>
						<TitleInput title={postData.title} onTitleChange={handleTitleChange} />
						<DescriptionInput description={postData.description} onDescriptionChange={handleDescriptionChange} />

						<CategoryInput onCategoryChange={(category) => setPostData({ ...postData, category })} />

						<PartsInput parts={postData.part} onPartsChange={handlePartsChange} />
						{/* <TagInput<PostEditFormData>
							postData={postData}
							setPostData={setPostData}
							onTagsChange={(tags) => handleTagsChange(tags)}
						/> */}

						<SaveButton type="submit" />

						{/* TODO: 投稿を削除できるようにする */}
						<DeletePostButton onDeleteConfirmed={handleDeletePost} />
					</form>
					{/* <PreviewSection /> */}
				</div>
			</div>
		</div>
	)
}

export default PostEditForm
