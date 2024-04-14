'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'
import { UserIdCheck } from '@/app/func/Useridcheck'
import Link from 'next/link'

interface PostDBinsert {
	id: string
	title: string
	description: string
	imageurl?: string
	videourl?: string
	tags?: string[]
}

const UploadPage = () => {
	const status = SessionCheck()
	const userEmail = UserIdCheck()

	const [postData, setPostData] = useState<PostDBinsert>({
		id: userEmail || '',
		title: '',
		description: '',
		imageurl: '',
		videourl: '',
		tags: []
	})

	const [file, setFile] = useState<File | null>(null)
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

			setFile(file)
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

					if (file.type.startsWith('video/')) {
						setPostData((prevPostData) => ({
							...prevPostData,
							videourl: data.url
						}))
						setHasUploadedVideo(true)
					} else if (file.type.startsWith('image/')) {
						setPostData((prevPostData) => ({
							...prevPostData,
							imageurl: prevPostData.imageurl ? `${prevPostData.imageurl},${data.url}` : data.url
						}))
					}
				} else {
					console.error('Error uploading file:', response.statusText)
				}
			} catch (error) {
				console.error('Error uploading file:', error)
			} finally {
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
				setPostData({
					id: userEmail || '',
					title: '',
					description: '',
					imageurl: '',
					videourl: '',
					tags: []
				})
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

	if (status === 'authenticated') {
		return (
			<div className="bg-white text-black min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="bg-white rounded-lg p-8 shadow-lg">
						<h1 className="text-4xl font-bold mb-8">投稿を作成</h1>

						{/* タイトル */}
						<div className="mb-8">
							<h2 className="text-2xl font-semibold mb-2">タイトル</h2>
							<input
								type="text"
								placeholder="タイトル入力"
								className="w-full bg-gray-200 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
								value={postData.title}
								onChange={(e) => setPostData({ ...postData, title: e.target.value })}
							/>
						</div>

						{/* 説明文 */}
						<div className="mb-8">
							<h2 className="text-2xl font-semibold mb-2">説明文</h2>
							<textarea
								placeholder="説明文を入力"
								className="w-full h-60 bg-gray-200 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
								value={postData.description}
								onChange={(e) => setPostData({ ...postData, description: e.target.value })}
							/>
						</div>

						{/* タグ */}
						<div className="mb-8">
							<h2 className="text-2xl font-semibold mb-2">タグ</h2>
							<div>
								<input
									type="text"
									placeholder="複数のタグを入力する場合は[タグを追加]ボタンを押すか、Enterキーを押してください"
									className="w-full bg-gray-200 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
									value={tagInput}
									onChange={handleTagInputChange}
									onKeyDown={handleKeyDown}
								/>
								<button
									className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
									onClick={handleAddTags}
								>
									タグを追加
								</button>
								<div className="flex flex-wrap mt-4">
									{postData.tags?.map((tag, index) => (
										<div key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
											<span>{tag}</span>
											<button
												className="ml-2 text-gray-600 hover:text-gray-800"
												onClick={() =>
													setPostData((prevState) => ({
														...prevState,
														tags: prevState.tags?.filter((_, i) => i !== index) || []
													}))
												}
											>
												×
											</button>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* アップロードボタン */}
						<div className="mb-8 text-center">
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								onChange={handleFileChange}
								accept="image/*,video/*"
								disabled={hasUploadedVideo}
							/>
							<button
								className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
								title="画像か動画をアップロードする"
								onClick={handleClickUpload}
								disabled={hasUploadedVideo}
							>
								画像・動画をアップする
							</button>
						</div>

						{/* 保存ボタン */}
						<div className="text-center">
							<button
								className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
								onClick={handleSavePostRequest}
							>
								保存する
							</button>
						</div>

						{/* プレビュー */}
						<div className="mt-8">
							<h2 className="text-2xl font-semibold mb-4 text-center">アップロードしたファイルのプレビュー</h2>
							{postData.videourl && (
								<>
									<video controls src={postData.videourl} className="max-w-full mx-auto mb-4" />
								</>
							)}
							{postData.imageurl &&
								postData.imageurl
									.split(',')
									.map((imageUrl, index) => (
										<img
											key={index}
											src={imageUrl}
											alt={`Uploaded Image ${index + 1}`}
											className="max-w-full mx-auto mb-4"
										/>
									))}
						</div>
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
