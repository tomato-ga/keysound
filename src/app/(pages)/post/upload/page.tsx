'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'
import { UserIdCheck } from '@/app/func/Useridcheck'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import TitleInput from '@/app/components/Upload/TitleInput'
import DescriptionInput from '@/app/components/Upload/DescriptionInput'
import TagInput from '@/app/components/Upload/Taginput'
import FileUploadButton from '@/app/components/Upload/FileUploadButton'
import SaveButton from '@/app/components/Upload/SaveButton'
import PreviewSection from '@/app/components/Upload/PreviewSection'

interface postDbInsert {
	id: string
	title: string
	description: string
	imageurl?: string
	videourl?: string
	tags?: string[]
}

const UploadPage = () => {
	const router = useRouter()
	const status = SessionCheck()
	const userEmail = UserIdCheck()

	const [postData, setPostData] = useState<postDbInsert>({
		id: userEmail || '',
		title: '',
		description: '',
		imageurl: '',
		videourl: '',
		tags: []
	})

	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isLoading, setIsLoading] = useState(false)
	const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false)
	const [tagInput, setTagInput] = useState<string>('')

	useEffect(() => {
		setPostData((prevPostData) => ({
			...prevPostData,
			imageurl: postData.imageurl?.split(',').join(',') || ''
		}))
	}, [postData.imageurl])

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const fileSizeInMB = file.size / (1024 * 1024)
			if (fileSizeInMB > 100) {
				alert('ファイルサイズが100MBを超えています。動画のファイルサイズが100MB以下の場合にアップロードできます')
				return
			}

			setIsLoading(true)

			try {
				const formData = new FormData()
				formData.append('file', file)

				const response = await fetch('/api/r2upload', {
					method: 'POST',
					body: formData
				})

				if (response.ok) {
					const data = await response.json()

					if (file.type.startsWith('image/')) {
						setPostData((prevPostData) => ({
							...prevPostData,
							imageurl: prevPostData.imageurl ? `${prevPostData.imageurl},${data.url}` : data.url
						}))
					} else if (file.type.startsWith('video/')) {
						setPostData((prevPostData) => ({
							...prevPostData,
							videourl: data.url
						}))
						setHasUploadedVideo(true)
					}
				} else {
					console.error('Error uploading file:', response.statusText)
				}
				setIsLoading(false)
			} catch (error) {
				console.error('Error uploading file:', error)
				setIsLoading(false)
			}
		}
	}

	const handleClickUpload = () => {
		fileInputRef.current?.click()
	}

	const handleSavePostRequest = async () => {
		try {
			const response = await fetch('/api/db/savePost', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(postData)
			})

			if (response.ok) {
				const data = await response.json()
				const createdPost = data.res

				// アップロード完了後、/post/postIdにリダイレクト
				router.push(`/post/${createdPost.id}`)
			} else {
				console.error('Error saving post:', response.statusText)
			}
		} catch (error) {
			console.error('Error saving post:', error)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTags()
		}
	}

	const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTagInput(e.target.value)
	}

	const handleAddTags = () => {
		if (tagInput.trim()) {
			const newTags = tagInput
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag !== '')
			setPostData((prevState) => ({
				...prevState,
				tags: [...(prevState.tags || []), ...newTags]
			}))
			setTagInput('')
		}
	}

	const handleRemoveTag = (index: number) => {
		setPostData((prevState) => ({
			...prevState,
			tags: prevState.tags?.filter((_, i) => i !== index) || []
		}))
	}

	if (status === 'authenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white">
						<h1 className="text-4xl font-bold mb-8">投稿を作成</h1>

						<TitleInput
							title={postData.title}
							onTitleChange={(e) => setPostData({ ...postData, title: e.target.value })}
						/>

						<DescriptionInput
							description={postData.description}
							onDescriptionChange={(e) => setPostData({ ...postData, description: e.target.value })}
						/>

						<TagInput
							tags={postData.tags || []}
							tagInput={tagInput}
							onTagInputChange={handleTagInputChange}
							onAddTags={handleAddTags}
							onRemoveTag={handleRemoveTag}
						/>

						<FileUploadButton onFileChange={handleFileChange} hasUploadedVideo={hasUploadedVideo} />

						<SaveButton onSave={handleSavePostRequest} />

						<PreviewSection
							videoUrl={postData.videourl}
							imageUrls={postData.imageurl?.split(',') || []}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		)
	} else if (!status || status === 'unauthenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<p>
						<Link href={`/login`} className="text-black hover:text-gray-800">
							ログインしてください
						</Link>
					</p>
				</div>
			</div>
		)
	}

	return null
}

export default UploadPage
