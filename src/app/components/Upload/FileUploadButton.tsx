import React from 'react'

interface FileUploadButtonProps {
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	hasUploadedVideo: boolean
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileChange, hasUploadedVideo }) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	const handleClickUpload = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className="mb-8 text-center">
			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				onChange={onFileChange}
				accept="video/*"
				disabled={hasUploadedVideo}
			/>
			<button
				className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
				title="動画をアップロードする"
				onClick={handleClickUpload}
				disabled={hasUploadedVideo}
			>
				動画を選択 <br />
				<small>※アップロードできるファイルは100MBまでとなっています</small>
			</button>
		</div>
	)
}

export default FileUploadButton
