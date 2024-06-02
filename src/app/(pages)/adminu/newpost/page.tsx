'use client'

import { useState, ChangeEvent } from 'react'
import AdminLayout from '../postlists/layout'
import FileUploadArea from '../admincomponent/drag'
import ThumbnailUploader from '../admincomponent/ThumbnailUploader'
import { saveArticle } from '@/app/actions/saveBlogPost/saveBlogPost'

interface UploadResponse {
	urls: string[]
}

interface EditorProps {
	initialTitle?: string
	initialContent?: string
	initialTags?: string
	postId?: string | null
	onSave: (data: { title: string; content: string; tags: string[]; postId?: string | null }) => void
}

const Editor: React.FC<EditorProps> = ({
	initialTitle = '',
	initialContent = '',
	initialTags = '',
	postId,
	onSave
}) => {
	console.log('postId: ', postId)

	const [title, setTitle] = useState<string>(initialTitle)
	const [content, setContent] = useState<string>(initialContent)
	const [tags, setTags] = useState<string>(initialTags)

	const author = 'dondonbe'
	const [showPreview, setShowPreview] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [toast, setToast] = useState({ show: false, message: '' })

	const showToast = (message: string) => {
		setToast({ show: true, message })
		setTimeout(() => setToast({ show: false, message: '' }), 5000)
	}

	const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)
	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
	const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)

	const onFileSelected = (files: File[]) => {
		setSelectedFiles(files)
	}

	const handleNewSave = async () => {
		console.log('handleNewSave called')
		const tagsArray = tags.split(',').map((tag) => tag.trim())
		console.log('tagsArray:', tagsArray)
		try {
			const newArticle = await saveArticle(title, content, tagsArray, author)
			console.log('Article saved:', newArticle)
			showToast('記事がデータベースに保存されました')
		} catch (error) {
			console.error('Error in handleNewSave:', error)
			showToast('記事の保存に失敗しました')
		}
	}

	const handleButtonClick = async () => {
		console.log('handleButtonClick called')
		const tagsArray = tags
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '')
		console.log('tagsArray on button click:', tagsArray)
		if (onSave) {
			try {
				onSave({ title, content, tags: tagsArray, postId })
				console.log('Article saved via onSave callback')
				showToast('記事が正常に保存されました。')
			} catch (error) {
				console.error('Error in handleButtonClick with onSave:', error)
				showToast('記事の保存中にエラーが発生しました。')
			}
		} else {
			await handleNewSave()
		}
	}

	// const uploadImages = async (files: File[]) => {
	// 	const formData = new FormData()
	// 	files.forEach((file) => formData.append('files', file))

	// 	try {
	// 		const response = await fetch('/api/admin_s3upload', {
	// 			method: 'POST',
	// 			body: formData
	// 		})

	// 		const data = await response.json()
	// 		console.log('アップロードしたdata構造確認', data.urls)

	// 		if (!response.ok) {
	// 			const errorMessage = data.error || 'アップロード失敗'
	// 			console.error('アップロードエラー:', errorMessage)
	// 			showToast(`画像アップロードエラー: ${errorMessage}`)
	// 			return
	// 		}

	// 		let markdownImages = data.urls
	// 			.map((url: string) => {
	// 				const fileName = url.split('/').pop()
	// 				return `![${fileName}](${url})`
	// 			})
	// 			.join('\n')
	// 		setContent((prev) => `${prev}\n${markdownImages}`)
	// 		showToast('画像アップロード成功')
	// 	} catch (error) {
	// 		console.error('アップロード中にエラーが発生しました:', error)
	// 		showToast('画像アップロード中にエラーが発生しました')
	// 	}
	// }

	const togglePreview = () => {
		setShowPreview(!showPreview)
	}

	return (
		<AdminLayout>
			<div className="flex items-center justify-center flex-col">
				<h1 className="text-xl mt-4 border-b-2">タイトル</h1>
				<textarea
					value={title}
					onChange={handleTitleChange}
					rows={3}
					style={{ width: '90%' }}
					placeholder="タイトル入力"
					className="border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">コンテンツ本文</h2>
				<textarea
					value={content}
					onChange={handleContentChange}
					rows={50}
					style={{ width: '90%' }}
					placeholder="コンテンツをここに入力"
					className="border-2 m-2"
				></textarea>

				<h2 className="text-xl mt-4 border-b-2">タグ</h2>
				<input
					type="text"
					value={tags}
					onChange={handleTagsChange}
					style={{ width: '90%' }}
					placeholder="タグをカンマ区切りで入力"
					className="border-2 m-2 h-20"
				/>

				<FileUploadArea
					onFileSelected={setSelectedFiles}
					// onUpload={uploadImages}
					onUploadSuccess={() => showToast('ファイルが正常にアップロードされました')}
					onUploadFailure={(error) => showToast(`ファイルアップロード失敗: ${error}`)}
				/>

				{postId && (
					<ThumbnailUploader
						postId={postId}
						onUploadSuccess={() => showToast('サムネイルSQLが正常にアップデートされました')}
						onUploadFailure={(error) => showToast(`サムネイルSQLアップデート失敗: ${error}`)}
					/>
				)}

				<button onClick={handleButtonClick} className="bg-blue-500 text-white p-2 rounded mt-4">
					保存
				</button>
				{toast.show && <span className="ml-4 text-green-600">{toast.message}</span>}

				{toast.show && (
					<div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 border border-blue-300 shadow-lg rounded-md bg-blue-100 text-blue-800">
						{toast.message}
					</div>
				)}
			</div>
		</AdminLayout>
	)
}

export default Editor
