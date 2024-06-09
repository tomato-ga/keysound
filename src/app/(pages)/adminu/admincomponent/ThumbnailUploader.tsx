import React, { useState, DragEvent } from 'react'

interface ThumbnailUploaderProps {
	onUploadSuccess: (url: string) => void
	onUploadFailure: (error: string) => void
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ onUploadSuccess, onUploadFailure }) => {
	const [dragOver, setDragOver] = useState<boolean>(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(true)
	}

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragOver(false)
		const file = e.dataTransfer.files[0] || null
		setSelectedFile(file)
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null
		console.log('Selected file:', file)
		setSelectedFile(file)
	}

	const handleUpload = async () => {
		if (!selectedFile) return

		const formData = new FormData()
		formData.append('files', selectedFile)

		try {
			const response = await fetch('/api/r2blogimage', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Image upload failed:', errorData.error)
				onUploadFailure(`Image upload failed: ${errorData.error}`)
				return
			}

			const data = await response.json()
			console.log('Server response:', data)

			if (!data.urls || !data.urls[0]) {
				onUploadFailure('No URL returned from the server.')
				return
			}

			const thumbUrl = data.urls[0]
			console.log('アップロードされたサムネイルURL:', thumbUrl)

			onUploadSuccess(thumbUrl)
		} catch (error) {
			console.error('Error uploading image:', error)
			onUploadFailure('An error occurred while uploading the image.')
		}
	}

	return (
		<div
			className={`drop-area ${dragOver ? 'drag-over' : ''} m-4`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>ファイルをここにドロップ</p>
			{selectedFile && <div>選択されたファイル: {selectedFile.name}</div>}
			<input type="file" onChange={handleFileChange} />
			<button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded mt-4">
				Upload Thumbnail
			</button>
		</div>
	)
}

export default ThumbnailUploader
