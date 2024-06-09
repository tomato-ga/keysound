import React, { useState, DragEvent } from 'react'

interface FileUploadAreaProps {
	onFileSelected: (files: File[]) => void
	onUpload: (files: File[]) => Promise<void>
	onUploadSuccess: () => void
	onUploadFailure: (error: string) => void
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
	onFileSelected,
	onUpload,
	onUploadSuccess,
	onUploadFailure
}) => {
	const [dragOver, setDragOver] = useState<boolean>(false)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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
		const files = Array.from(e.dataTransfer.files)
		setSelectedFiles((prevFiles) => [...prevFiles, ...files])
		onFileSelected([...selectedFiles, ...files])
	}

	const handleUpload = async () => {
		try {
			await onUpload(selectedFiles)
			onUploadSuccess()
			setSelectedFiles([])
		} catch (error) {
			onUploadFailure(error instanceof Error ? error.message : String(error))
		}
	}

	return (
		<div
			className={`drop-area ${dragOver ? 'drag-over' : ''}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>ファイルをここにドロップ</p>
			{selectedFiles.map((file, index) => (
				<div key={index}>選択されたファイル: {file.name}</div>
			))}
			<button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded mt-4">
				画像アップロード
			</button>
		</div>
	)
}

export default FileUploadArea
