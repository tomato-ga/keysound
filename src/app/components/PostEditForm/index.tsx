// /Users/ore/Documents/GitHub/keysound/src/app/components/PostEditForm/index.tsx
'use client'
import { prisma } from '@/app/lib/prisma'
import { Post, PostFormData, PostPart, PostEditFormData, UpdateTags, UpdateParts } from '../../../../types'
import TitleInput from '../Upload/TitleInput'
import DescriptionInput from '../Upload/DescriptionInput'
import PartsInput from '../Upload/PartsInput'
import TagInput from '../Upload/Taginput'
import FileUploadButton from '../Upload/FileUploadButton'
import SaveButton from '../Upload/SaveButton'
import PreviewSection from '../Upload/PreviewSection'
import { useState, ChangeEvent } from 'react'

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
		tags: post.tags
	})

	console.log('PostEditForm State', postData)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			// TODO: 更新リクエストを送信する処理を実装
			console.log('Updated postData data:', postData)
		} catch (error) {
			console.error('Error updating post:', error)
		}
	}

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

	const handleTagsChange = (tags: UpdateTags[]) => {
		setPostData((prevData) => ({ ...prevData, tags: tags.map((tag) => tag.name) }))
	}

	return (
		<div className="bg-white text-black min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="bg-white">
					<h1 className="text-4xl font-bold mb-8">投稿を編集</h1>
					<form onSubmit={handleSubmit}>
						<TitleInput title={postData.title} onTitleChange={handleTitleChange} />
						<DescriptionInput description={postData.description} onDescriptionChange={handleDescriptionChange} />

						{/* TODO パーツの動作確認から */}
						<PartsInput parts={postData.part} onPartsChange={handlePartsChange} />
						<TagInput tags={postData.tags.map((tag) => ({ id: '', name: tag }))} onTagsChange={handleTagsChange} />
						{/* TODO: ファイルを削除できるようにする memo: 上げ直したりする可能性 */}
						{/* <FileUploadButton /> */}
						<SaveButton type="submit" />
					</form>
					{/* <PreviewSection /> */}
				</div>
			</div>
		</div>
	)
}

export default PostEditForm
