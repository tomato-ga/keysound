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
		if (file) {
			if (!file.type.startsWith('video/')) {
				alert('動画ファイルのみアップロードできます')
				return
			}

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
					setPostData((prevPostData) => ({
						...prevPostData,
						videourl: data.url
					}))
					setHasUploadedVideo(true)
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

	const isSaveButtonDisabled = !postData.title || !hasUploadedVideo

	const handleFormSubmission = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!postData.title || !postData.videourl) {
			if (!postData.title && !postData.videourl) {
				toast.error('タイトルと動画をアップロードしてください')
			} else if (!postData.title) {
				toast.error('タイトルは必須です')
			} else if (!postData.videourl) {
				toast.error('動画をアップロードしてください')
			}
		} else {
			// フォームの送信
			document.forms[0].submit()
		}
	}

	useEffect(() => {
		toast('ページが読み込まれました。')
	}, [])

	if (status === 'authenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white">
						<h1 className="text-4xl font-bold mb-8">投稿を作成</h1>

						{/* TODO タイトルと動画を必須にする */}
						<form action={savePostAction}>
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

							<SaveButton type="button" disabled={isSaveButtonDisabled} onClick={handleFormSubmission} />

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
