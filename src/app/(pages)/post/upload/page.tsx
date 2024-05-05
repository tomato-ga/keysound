'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'
import { UserIdCheck } from '@/app/func/Useridcheck'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import TitleInput from '@/app/components/Upload/TitleInput'
import DescriptionInput from '@/app/components/Upload/DescriptionInput'

import FileUploadButton from '@/app/components/Upload/FileUploadButton'
import SaveButton from '@/app/components/Upload/SaveButton'
import PreviewSection from '@/app/components/Upload/PreviewSection'
import { PostFormData, PostPart } from '../../../../../types'
import { handleSavePost } from '@/app/actions/handleSavePost/handleSavePost'
import PartsInput from '@/app/components/Upload/PartsInput'
import CategoryInput from '@/app/components/Upload/CategoryInput'

import { savePostAction } from '@/app/actions/savePost/savePost'
import RemoveVideoButton from '@/app/components/Upload/RemoveVideoButton'
import { handleRemoveVideo } from '@/app/actions/handleRemoveVideo/handleRemoveVideo'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../../../../customtoast.css'

export default function UploadPage() {
	const router = useRouter()
	const status = SessionCheck()
	const userEmail = UserIdCheck()
	const [postData, setPostData] = useState<PostFormData>({
		title: '',
		description: '',
		parts: [{}],
		videourl: '',
		category: ''
		// tags: []
	})

	const [isLoading, setIsLoading] = useState(false)
	const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false)

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('video/')) {
			toast('動画ファイルのみアップロードできます')
			return
		}
		const fileSizeInMB = file.size / (1024 * 1024)
		if (fileSizeInMB > 100) {
			toast.error('ファイルサイズが100MBを超えています。動画のファイルサイズが100MB以下の場合にアップロードできます')
			return
		}

		setIsLoading(true)

		try {
			const presignResponse = await fetch(`/api/get-presigned-url?fileName=${encodeURIComponent(file.name)}`)
			const presignData = await presignResponse.json()
			if (!presignResponse.ok) {
				throw new Error(presignData.error || 'Failed to get presigned URL')
			}

			const uploadResponse = await fetch(presignData.url, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type
				},
				body: file
			})

			if (!uploadResponse.ok) {
				throw new Error('Upload failed')
			}

			console.log('File uploaded successfully:', presignData.url)
			setPostData((prev) => ({ ...prev, videourl: presignData.url }))
			setHasUploadedVideo(true)
		} catch (error) {
			console.error('Error uploading file:', error)
			toast.error('アップロードに失敗しました。')
		} finally {
			setIsLoading(false)
		}
	}

	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleRemoveVideoClick = async () => {
		const result = await handleRemoveVideo(postData)
		if (result.success) {
			setPostData({ ...postData, videourl: '' })
			setHasUploadedVideo(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const handleFormSubmission = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!postData.title || !postData.videourl) {
			if (!postData.title && !postData.videourl) {
				toast.error('タイトルと動画アップロードは必須です')
			} else if (!postData.title) {
				toast.error('タイトルは必須です')
			} else if (!postData.videourl) {
				toast.error('動画アップロードは必須です')
			}
		} else {
			const formData = new FormData()
			formData.append('title', postData.title)
			formData.append('description', postData.description)
			formData.append('videourl', postData.videourl)
			formData.append('category', postData.category)
			formData.append('partCase', postData.parts[0]?.case || '')
			formData.append('partPlate', postData.parts[0]?.plate || '')
			formData.append('partSwitches', postData.parts[0]?.switches || '')
			formData.append('partKeyCaps', postData.parts[0]?.keyCaps || '')

			await savePostAction(formData)
		}
	}

	if (status === 'authenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white">
						<h1 className="text-4xl font-bold mb-8">投稿を作成</h1>

						<form>
							<TitleInput
								title={postData.title}
								onTitleChange={(e) => setPostData({ ...postData, title: e.target.value })}
							/>

							<DescriptionInput
								description={postData.description}
								onDescriptionChange={(e) => setPostData({ ...postData, description: e.target.value })}
							/>

							<CategoryInput onCategoryChange={(category) => setPostData({ ...postData, category })} />

							<PartsInput
								parts={postData.parts}
								onPartsChange={(part) => {
									setPostData({ ...postData, parts: [part as PostPart] })
								}}
							/>

							<FileUploadButton
								ref={fileInputRef}
								onFileChange={handleFileChange}
								hasUploadedVideo={hasUploadedVideo}
								videoUrl={postData.videourl}
							/>

							<SaveButton type="button" onClick={handleFormSubmission} />
						</form>
						<RemoveVideoButton onRemoveVideo={handleRemoveVideoClick} hasUploadedVideo={hasUploadedVideo} />

						<PreviewSection videoUrl={postData.videourl} isLoading={isLoading} />
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
