'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { SessionCheck } from '@/app/func/Sessioncheck'

// TODO メーカー名などを判別するタグ・カテゴリーは必要か？最初はいらないか -> あとで欲しくなるやつ

const UploadPage = () => {
	const status = SessionCheck()

	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [file, setFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isLoading, setIsLoading] = useState(false)

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
					// アップロードされたファイルのURLを処理する
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
			<div className="flex items-start justify-center h-screen p-6">
				<div className="bg-white rounded-lg w-full lg:max-w-4xl ">
					<div className="flex">
						{/* Main content */}
						<div className="flex-1 p-4">
							<div className="mb-4">
								<h1 className="text-xl font-bold mb-2">タイトル</h1>
								<input
									type="text"
									placeholder="タイトル入力"
									className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div>
								<h1 className="text-xl font-bold mb-2">説明文</h1>
								<textarea
									placeholder="説明文を入力"
									className="w-full h-60 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
						</div>
						{/* Sidebar for buttons */}
						<div className="flex flex-col space-y-4 p-4 mt-4">
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								onChange={handleFileChange}
								accept="image/*,video/*"
							/>
							<button
								className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full"
								title="画像か動画をアップロードする"
								onClick={handleClickUpload}
							>
								<span>画像・動画をアップする</span>
							</button>

							{isLoading && (
								<div className="flex justify-center items-center">
									<div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full animate-spin-slow"></div>
								</div>
							)}

							<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center space-x-2">
								<span>保存する</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	} else if (!status || status === 'unauthenticated') {
		return <p>ログインしてください</p>
	}
}

export default UploadPage
