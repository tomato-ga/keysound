'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'

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

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
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
					console.log('Uploaded URL: ', data.url)

					if (file.type.startsWith('video/')) {
						setUploadedVideo(data.url)
						setHasUploadedVideo(true) // 動画がアップロードされた場合にフラグを立てる
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
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					{/* 説明文 */}
					<div className="mb-4 p-4">
						<h1 className="text-xl font-bold mb-2">説明文</h1>
						<textarea
							placeholder="説明文を入力"
							className="w-full h-60 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
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
					{/* TODO 保存ボタンを押したら、Supabaseに保存する */}
					<div className="mb-4 p-4 text-center">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
							保存する
						</button>
					</div>
					{/* プレビュー */}
					<div className="mb-4 p-4">
						<h2 className="text-xl font-bold mb-2 text-center">アップロードするファイルのプレビュー</h2>
						{uploadedVideo && <video controls src={uploadedVideo} className="max-w-xs mx-auto" />} <br />
						{uploadedImages &&
							uploadedImages.map((imageUrl, index) => (
								<img key={index} src={imageUrl} alt={`Uploaded Image ${index + 1}`} className="max-w-xs mx-auto mb-2" />
							))}
					</div>
				</div>
			</div>
		)
	} else if (!status || status === 'unauthenticated') {
		return <p>ログインしてください</p>
	}
}

export default UploadPage
