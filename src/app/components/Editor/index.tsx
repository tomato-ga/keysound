'use client'

import { useState, ChangeEvent } from 'react'
import AdminLayout from '@/app/(pages)/adminu/postlists/layout'
import FileUploadArea from '@/app/(pages)/adminu/admincomponent/drag'
import ThumbnailUploader from '@/app/(pages)/adminu/admincomponent/ThumbnailUploader'
import ImagePreview from '@/app/(pages)/adminu/admincomponent/ImagePreview'
import { saveArticle, saveUpdateArticle } from '@/app/actions/saveBlogPost/saveBlogPost'
import { EditorProps } from '../../../../types'

interface ArticleData {
	title: string
	content: string
	tags: string[]
	thumb_url: string
	postId?: number | null
}

const Editor: React.FC<EditorProps> = ({
	initialTitle = '',
	initialContent = '',
	initialTags = '',
	postId,
	onSave
}: EditorProps) => {
	const [title, setTitle] = useState<string>(initialTitle)
	const [content, setContent] = useState<string>(initialContent)
	const [tags, setTags] = useState<string>(initialTags)
	const [thumbUrl, setThumbUrl] = useState<string>('')
	const [imageUrls, setImageUrls] = useState<string[]>([])

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

	const handleNewSave = async (articleData: ArticleData) => {
		const { title, content, tags, thumb_url } = articleData
		try {
			const newArticle = await saveArticle(title, content, tags, author, thumb_url)
			console.log('記事が保存されました:', newArticle)
			showToast('記事がデータベースに保存されました')
		} catch (error) {
			console.error('handleNewSave中にエラーが発生しました:', error)
			showToast('記事の保存に失敗しました')
		}
	}

	const handleUpdateSave = async (articleData: ArticleData) => {
		const { title, content, tags, thumb_url, postId } = articleData
		if (postId === null || postId === undefined) return
		try {
			const updatedArticle = await saveUpdateArticle(title, content, tags, author, thumb_url, postId)
			console.log('記事が更新されました:', updatedArticle)
			showToast('記事がデータベースに更新されました')
		} catch (error) {
			console.error('handleUpdateSave中にエラーが発生しました:', error)
			showToast('記事の更新に失敗しました')
		}
	}

	const handleButtonClick = async () => {
		const tagsArray = tags
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '')

		const articleData: ArticleData = { title, content, tags: tagsArray, thumb_url: thumbUrl, postId }

		if (postId && onSave) {
			try {
				onSave(articleData)
				console.log('Article saved via onSave callback')
				showToast('記事が正常に保存されました。')
			} catch (error) {
				console.error('Error in handleButtonClick with onSave:', error)
				showToast('記事の保存中にエラーが発生しました。')
			}
		} else {
			await handleNewSave(articleData)
		}
	}

	const uploadImages = async (files: File[]) => {
		if (files.length === 0) {
			showToast('アップロードするファイルが選択されていません')
			return
		}

		const formData = new FormData()
		files.forEach((file) => formData.append('files', file))

		try {
			const response = await fetch('/api/r2blogimage', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) {
				const errorMessage = `アップロード失敗: ${response.statusText}`
				console.error('アップロードエラー:', errorMessage)
				showToast(`画像アップロードエラー: ${errorMessage}`)
				return
			}

			const data = await response.json()
			console.log('APIレスポンス:', data) // レスポンスをログに出力

			if (!data.urls || !data.urls[0]) {
				showToast('No URL returned from the server.')
				return
			}

			const uploadedImageUrl = data.urls[0]
			console.log('アップロードされたURL:', uploadedImageUrl)

			setImageUrls((prev) => [...prev, uploadedImageUrl])
			setContent((prev) => `${prev}\n![${uploadedImageUrl}](${uploadedImageUrl})`)
			showToast('画像アップロード成功')
		} catch (error) {
			console.error('アップロード中にエラーが発生しました:', error)
			showToast('画像アップロード中にエラーが発生しました')
		}
	}

	const deleteImage = (url: string) => {
		if (url === thumbUrl) {
			setThumbUrl('')
		} else {
			setImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url))
			setContent((prev) =>
				prev
					.split('\n')
					.filter((line) => !line.includes(url))
					.join('\n')
			)
		}
		showToast('画像が削除されました')
	}

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
					onUpload={uploadImages}
					onUploadSuccess={() => showToast('ファイルが正常にアップロードされました')}
					onUploadFailure={(error) => showToast(`ファイルアップロード失敗: ${error}`)}
				/>

				<ThumbnailUploader
					onUploadSuccess={(url) => {
						setThumbUrl(url)
						showToast('サムネイルが正常にアップロードされました')
					}}
					onUploadFailure={(error) => showToast(`サムネイルアップロード失敗: ${error}`)}
				/>

				<ImagePreview imageUrls={imageUrls} thumbUrl={thumbUrl} onDelete={deleteImage} />

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
