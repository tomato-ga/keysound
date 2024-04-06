'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'
import { UserIdCheck } from '@/app/func/Useridcheck'
import Link from 'next/link'
import { prisma } from '@/app/lib/prisma'

interface postDBinsert {
	id: string
	title: string
	description: string
	imageurl?: string
	videourl?: string
	tags?: string[]
}

// interface VideoResolution {
// 	width: number
// 	height: number
// }

// videoのurlを引数に入れる関数
// function fetchVideoInfo(url: string): Promise<VideoResolution> {
// 	return new Promise((resolve) => {
// 		var video = document.createElement('video')
// 		video.setAttribute('crossOrigin', 'anonymous')
// 		video.src = url
// 		video.addEventListener('loadedmetadata', () => {
// 			console.log('解像度', video.videoWidth, video.videoHeight) // ここで解像度をログに出力
// 			resolve({
// 				width: video.videoWidth,
// 				height: video.videoHeight
// 			})
// 		})
// 	})
// }

const UploadPage = () => {
	const status = SessionCheck()

	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [file, setFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isLoading, setIsLoading] = useState(false)
	const [uploadedVideo, setUploadedVideo] = useState<string>('')
	const [uploadedImages, setUploadedImages] = useState<string[]>([])
	const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false)
	const [tagInput, setTagInput] = useState<string>('')

	const userEmail = UserIdCheck()
	const [postData, setPostData] = useState<postDBinsert>({
		id: userEmail || '',
		title: '',
		description: '',
		imageurl: '',
		videourl: '',
		tags: []
	})

	useEffect(() => {
		setPostData((prevPostData) => ({
			...prevPostData,
			videourl: uploadedVideo,
			imageurl: uploadedImages.join(',') // 複数の画像URLをカンマ区切りの文字列に変換
		}))
	}, [uploadedVideo, uploadedImages])

	// const [videoResolution, setVideoResolution] = useState<VideoResolution | null>(null)

	// 解像度に関するuseEffect
	// useEffect(() => {
	// 	const getVideoResolution = async () => {
	// 		if (uploadedVideo) {
	// 			// 5秒の遅延を設けて動画の読み込みを待つ
	// 			setTimeout(async () => {
	// 				const resolution = await fetchVideoInfo(uploadedVideo)
	// 				setVideoResolution(resolution)
	// 			}, 5000)
	// 		}
	// 	}
	// 	getVideoResolution()
	// }, [uploadedVideo])

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

			// API経由でアップロード処理
			const formData = new FormData()
			formData.append('file', file)

			try {
				const response = await fetch('/api/s3upload', {
					method: 'POST',
					body: formData
				})

				if (response.ok) {
					const data = await response.json()

					if (file.type.startsWith('video/')) {
						setUploadedVideo(data.url)
						// setVideoResolution({ width: data.width, height: data.height })
						setHasUploadedVideo(true) // 動画がアップロードされた場合にフラグを立てる

						console.log('Uploaded Video Reso: ', data.width, data.height)
					} else if (file.type.startsWith('image/')) {
						setUploadedImages((prevImages) => [...prevImages, data.url])
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

	// 解像度を取得するボタンのクリックイベントハンドラ
	// const fetchAndSetVideoResolution = async (url: string) => {
	// 	const resolution = await fetchVideoInfo(url)
	// 	setVideoResolution(resolution)
	// }

	// MEMO DBに保存したい内容
	// SQL : userid(google), title, description, audiourl, imageurl

	// DB Post 保存 prisma
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
				// 保存成功後の処理
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
		// Enterキーが押された場合
		if (e.key === 'Enter') {
			e.preventDefault() // フォームの送信を防ぐ
			handleAddTags() // タグの追加処理を実行
		}
	}

	// タグ入力フィールドに変更があった場合の処理
	const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTagInput(e.target.value) // 一時的なタグ入力値を更新
	}

	// タグの追加処理
	const handleAddTags = () => {
		if (tagInput.trim()) {
			const newTags = tagInput
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag !== '') // カンマで分割し、トリムしてから空ではないタグのみを配列に
			setPostData((prevState) => ({
				...prevState,
				tags: [...(prevState.tags || []), ...newTags] // 既存のタグ配列に新しいタグを追加
			}))
			setTagInput('') // 入力フィールドをリセット
		}
	}

	if (status === 'authenticated') {
		return (
			<div className="flex flex-col justify-start min-h-screen overflow-auto p-6">
				<div className="bg-white rounded-lg w-full lg:max-w-4xl mx-auto">
					{/* タイトル */}
					<div className="mb-4 p-4">
						<h1 className="text-xl font-bold mb-2">タイトル</h1>
						<input
							type="text"
							placeholder="タイトル入力"
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={postData.title}
							onChange={(e) => setPostData({ ...postData, title: e.target.value })}
						/>
					</div>
					{/* 説明文 */}
					<div className="mb-4 p-4">
						<h1 className="text-xl font-bold mb-2">説明文</h1>
						<textarea
							placeholder="説明文を入力"
							className="w-full h-60 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={postData.description}
							onChange={(e) => setPostData({ ...postData, description: e.target.value })}
						/>
					</div>

					{/* タグ */}
					<div className="mb-4 p-4">
						<h1 className="text-xl font-bold mb-2">タグ</h1>
						<div>
							<input
								type="text"
								placeholder="複数のタグを入力する場合は[タグを追加]ボタンを押すか、Enterキーを押してください"
								className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={tagInput}
								onChange={handleTagInputChange}
								onKeyDown={handleKeyDown} // onKeyDown ハンドラを追加
							/>
							<button
								className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								onClick={handleAddTags} // タグの追加ボタンにクリックイベントを設定
							>
								タグを追加
							</button>
							<div className="flex flex-wrap mt-2">
								{/* タグの表示と削除: postData.tagsがundefinedでないことを確認し、各タグを表示 */}
								{postData.tags?.map((tag, index) => (
									<div key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
										<span>{tag}</span>
										<button
											className="ml-2 text-gray-500 hover:text-gray-700"
											onClick={() =>
												setPostData((prevState) => ({
													...prevState,
													// タグの削除: 特定のインデックスのタグを除外
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
					<div className="mb-4 p-4 text-center">
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							onChange={handleFileChange}
							accept="image/*,video/*"
							disabled={hasUploadedVideo} // 動画がアップロードされた場合は無効化
						/>
						<button
							className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full"
							title="画像か動画をアップロードする"
							onClick={handleClickUpload}
							disabled={hasUploadedVideo} // 動画がアップロードされた場合は無効化
						>
							画像・動画をアップする
						</button>
					</div>
					{/* 保存ボタン */}
					{/* 保存ボタンを押したら、画面遷移させる 、今のままだと保存しても同じ画面にいるため、状態が変わらずに入力できる */}
					<div className="mb-4 p-4 text-center">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
							onClick={handleSavePostRequest}
						>
							保存する
						</button>
					</div>

					{/* プレビュー */}
					<div className="mb-4 p-4">
						<h2 className="text-xl font-bold mb-2 text-center">アップロードしたファイルのプレビュー</h2>
						{uploadedVideo && (
							<>
								<video controls src={uploadedVideo} className="max-w-xs mx-auto" />
							</>
						)}
						<br />
						{uploadedImages &&
							uploadedImages.map((imageUrl, index) => (
								<img key={index} src={imageUrl} alt={`Uploaded Image ${index + 1}`} className="max-w-xs mx-auto mb-2" />
							))}
					</div>
				</div>
			</div>
		)
	} else if (!status || status === 'unauthenticated') {
		return (
			<p>
				<Link href={`/login`}>ログインしてください</Link>
			</p>
		)
	}
}

export default UploadPage
