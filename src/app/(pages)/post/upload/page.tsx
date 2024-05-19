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

	const postData = watch()

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('video/')) {
			toast('動画ファイルのみアップロードできます')
			return
		}
		const fileSizeInMB = file.size / (1024 * 1024)
		if (fileSizeInMB > 500) {
			toast.error('ファイルサイズが500MBを超えています。動画のファイルサイズが500MB以下の場合にアップロードできます')
			return
		}

		setIsLoading(true)

		try {
			const presignResponse = await fetch(`/api/r2presigned?fileName=${encodeURIComponent(file.name)}`)
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
				try {
					const errorData = await uploadResponse.json()
					console.error('Upload failed with error data:', errorData)
					throw new Error(`Upload failed: ${errorData.message}`)
				} catch (parseError) {
					console.error('Failed to parse error response:', parseError)
					throw new Error('Upload failed')
				}
			}
			const uploadFileUrl = `https://data.keyboard-sound.net/` + presignData.objectKey

			console.log('File upload successful, setting videourl to', uploadFileUrl)
			setValue('videourl', uploadFileUrl)
			setIsLoading(false)
			setUploadOption(null)
		} catch (error: any) {
			console.error('Error uploading file:', error)
			toast.error('アップロードに失敗しました。')
			setIsLoading(false)
		}
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

	const handleYouTubeEmbedSubmit = (url: string) => {
		console.log('YouTube URL submitted:', url)
		setValue('youtube', url)
		setUploadOption('youtube')
	}

	const handleRemoveYouTubeUrl = () => {
		console.log('YouTube URL removed')
		setValue('youtube', '')
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

							{/* アップロードオプションの選択 */}
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

							{/* 動画のアップロードフォーム */}
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

							{/* YouTube動画の引用フォーム */}
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
