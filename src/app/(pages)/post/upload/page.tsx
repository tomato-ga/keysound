'use client'

import { useState, useRef, ChangeEvent } from 'react'
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

	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault()

	// 	try {
	// 		if (!userEmail) {
	// 			throw Error('User not found')
	// 		}

	// 		const postId = await handleSavePost(postData, userEmail)
	// 		router.push(`/post/${postId}`)
	// 	} catch (error) {
	// 		console.error('Error saving post: ', error)
	// 	}
	// }

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

							{/* TODO ファイルアップロードはできてるけど、videourlが取得できていないところから */}
							{/* TODO 一度動画アップロードしたら、削除（取り消し）できるようにしたい */}
							<FileUploadButton
								onFileChange={handleFileChange}
								hasUploadedVideo={hasUploadedVideo}
								videoUrl={postData.videourl}
							/>

							<SaveButton type="submit" />
						</form>

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
