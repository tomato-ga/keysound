'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { SessionCheck } from '@/app/func/Sessioncheck'
import { UserIdCheck } from '@/app/func/Useridcheck'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import TitleInput from '@/app/components/Upload/TitleInput'
import DescriptionInput from '@/app/components/Upload/DescriptionInput'
import FileUploadButton from '@/app/components/Upload/FileUploadButton'
import SaveButton from '@/app/components/Upload/SaveButton'
import PreviewSection from '@/app/components/Upload/PreviewSection'
import PartsInput from '@/app/components/Upload/PartsInput'
import CategoryInput from '@/app/components/Upload/CategoryInput'
import RemoveVideoButton from '@/app/components/Upload/RemoveVideoButton'
import YouTubeEmbedForm from '@/app/components/YouTubeForm'

import { PostFormData, PostPart } from '../../../../../types'
import { savePostAction } from '@/app/actions/savePost/savePost'
import { handleRemoveVideo } from '@/app/actions/handleRemoveVideo/handleRemoveVideo'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../../../../customtoast.css'

export default function UploadPage() {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors }
	} = useForm<PostFormData>({
		defaultValues: {
			title: '',
			description: '',
			parts: [{}],
			videourl: '',
			youtube: '',
			category: '1'
		}
	})

	const router = useRouter()
	const status = SessionCheck()
	const userEmail = UserIdCheck()
	const [isLoading, setIsLoading] = useState(false)
	const [uploadOption, setUploadOption] = useState<'upload' | 'youtube' | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

	const postData = watch()

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('video/')) {
			toast.error('動画ファイルのみアップロードできます')
			return
		}

		const fileSizeInMB = file.size / (1024 * 1024)
		if (fileSizeInMB > 500) {
			toast.error('ファイルサイズが500MBを超えています。動画のファイルサイズが500MB以下の場合にアップロードできます')
			return
		}

		setIsLoading(true)

		try {
			const presignedUrlResponse = await getPresignedUrl(file.name)
			await uploadFile(presignedUrlResponse, file)

			const uploadedFileUrl = `https://data.keyboard-sound.net/${presignedUrlResponse.objectKey}`
			setValue('videourl', uploadedFileUrl)
			toast.success('動画のアップロードが完了しました')
		} catch (error: any) {
			console.error('Error uploading file:', error)
			toast.error(`アップロードに失敗しました: ${extractErrorMessage(error)}`)
		} finally {
			setIsLoading(false)
			setUploadOption(null)
		}
	}

	const getPresignedUrl = async (fileName: string) => {
		const response = await fetch(`/api/r2presigned?fileName=${encodeURIComponent(fileName)}`)
		if (!response.ok) {
			const errorData = await response.json()
			console.error('Failed to get presigned URL:', errorData)
			throw new Error(errorData.error || 'Failed to get presigned URL')
		}
		return response.json()
	}

	const uploadFile = async (presignedUrl: { url: string; objectKey: string }, file: File) => {
		const response = await fetch(presignedUrl.url, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type
			},
			body: file
		})

		if (!response.ok) {
			const errorData = await response.json()
			console.error('Upload failed:', errorData)
			throw new Error(`Upload failed: ${errorData.message}`)
		}
	}

	const handleYouTubeEmbedSubmit = async (url: string) => {
		const youtubeRegex =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?(?:\S+)$/
		if (!youtubeRegex.test(url)) {
			toast.error('無効なYouTube URLです。動画ページのURLを入力してください')
			return
		}

		try {
			const videoId = extractVideoId(url)
			const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
			const uploadedThumbnailUrl = await uploadThumbnail(thumbnailUrl)

			setThumbnailUrl(uploadedThumbnailUrl)
			toast.success('サムネイルのアップロードが完了しました')
		} catch (error: any) {
			console.error('Error uploading thumbnail:', error)
			toast.error(`サムネイルのアップロードに失敗しました: ${extractErrorMessage(error)}`)
		}
	}

	const extractVideoId = (url: string) => {
		const videoId = new URL(url).searchParams.get('v')
		if (!videoId) {
			throw new Error('動画IDが取得できません')
		}
		return videoId
	}

	const uploadThumbnail = async (thumbnailUrl: string) => {
		const response = await fetch('/api/r2thumb', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: thumbnailUrl })
		})

		if (!response.ok) {
			const errorData = await response.json()
			console.error('Failed to upload thumbnail:', errorData)
			throw new Error(errorData.error || 'Failed to upload thumbnail')
		}

		const data = await response.json()
		return data.thumbnailUrl
	}

	const handleRemoveVideoClick = async () => {
		const result = await handleRemoveVideo(postData)
		if (result.success) {
			console.log('Video removed successfully')
			setValue('videourl', '')
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
			setUploadOption(null)
		}
	}

	const handleRemoveYouTubeUrl = () => {
		console.log('YouTube URL removed')
		setValue('youtube', '')
		setThumbnailUrl(null)
		setUploadOption(null)
	}

	const onSubmit: SubmitHandler<PostFormData> = async (data) => {
		console.log('Form submitted with data:', data)
		if (!data.title || (!data.videourl && !data.youtube)) {
			if (!data.title && !data.videourl && !data.youtube) {
				toast.error('タイトルと動画アップロードまたはYouTubeリンクは必須です')
			} else if (!data.title) {
				toast.error('タイトルは必須です')
			} else if (!data.videourl && !data.youtube) {
				toast.error('動画アップロードまたはYouTubeリンクは必須です')
			}
			return
		}

		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('description', data.description)
		if (data.videourl) {
			formData.append('videourl', data.videourl)
		}
		if (data.youtube) {
			formData.append('youtube', data.youtube)
		}
		formData.append('category', data.category)
		formData.append('partCase', data.parts[0]?.case || '')
		formData.append('partPlate', data.parts[0]?.plate || '')
		formData.append('partSwitches', data.parts[0]?.switches || '')
		formData.append('partKeyCaps', data.parts[0]?.keyCaps || '')

		const postId = await savePostAction(formData)

		router.push(`/post/${postId}`)
	}

	const extractErrorMessage = (error: Error) => {
		return error.message.replace(/.*:/, '').trim()
	}

	if (status === 'authenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white">
						<h1 className="text-4xl font-bold mb-8">投稿を作成</h1>

						<form onSubmit={handleSubmit(onSubmit)}>
							<TitleInput title={postData.title} onTitleChange={(e) => setValue('title', e.target.value)} />

							<DescriptionInput
								description={postData.description}
								onDescriptionChange={(e) => setValue('description', e.target.value)}
							/>

							<CategoryInput
								currentCategory={postData.category}
								onCategoryChange={(category) => setValue('category', category)}
							/>

							<PartsInput parts={postData.parts} onPartsChange={(part) => setValue('parts', [part as PostPart])} />

							<div className="mb-8 text-center">
								<label className="block mb-2 text-sm font-medium text-gray-700">アップロードオプションを選択</label>
								<div className="flex justify-center space-x-4">
									<button
										type="button"
										className={`px-4 py-2 rounded-md ${
											uploadOption === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'
										}`}
										onClick={() => setUploadOption('upload')}
										disabled={!!postData.youtube}
									>
										動画のアップロード
									</button>
									<button
										type="button"
										className={`px-4 py-2 rounded-md ${
											uploadOption === 'youtube' ? 'bg-blue-500 text-white' : 'bg-gray-200'
										}`}
										onClick={() => setUploadOption('youtube')}
										disabled={!!postData.videourl}
									>
										YouTube動画の引用
									</button>
								</div>
							</div>

							{uploadOption === 'upload' && (
								<Controller
									name="videourl"
									control={control}
									render={({ field }) => (
										<FileUploadButton
											ref={fileInputRef}
											onFileChange={handleFileChange}
											hasUploadedVideo={!!field.value}
											videoUrl={field.value}
										/>
									)}
								/>
							)}

							{uploadOption === 'youtube' && (
								<>
									<YouTubeEmbedForm onUrlChange={handleYouTubeEmbedSubmit} />
									{!!postData.youtube && (
										<div className="text-center mt-4">
											<button
												type="button"
												className="bg-red-500 text-white px-4 py-2 rounded-md mb-2"
												onClick={handleRemoveYouTubeUrl}
											>
												YouTube URLを削除
											</button>
										</div>
									)}
								</>
							)}

							<SaveButton type="submit" />
						</form>
						<RemoveVideoButton onRemoveVideo={handleRemoveVideoClick} hasUploadedVideo={!!postData.videourl} />

						<PreviewSection videoUrl={postData.videourl || postData.youtube} isLoading={isLoading} />
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
