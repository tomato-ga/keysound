'use client'

import React, { forwardRef } from 'react'

interface FileUploadButtonProps {
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	hasUploadedVideo: boolean
	videoUrl: string | undefined
}

const FileUploadButton = forwardRef<HTMLInputElement, FileUploadButtonProps>(
	({ onFileChange, hasUploadedVideo, videoUrl }, ref) => {
		const handleClickUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (ref && typeof ref === 'object' && 'current' in ref) {
				ref.current?.click()
			}
		}

		return (
			<div className="mb-8 text-center">
				<input
					type="file"
					ref={ref}
					className="hidden"
					onChange={onFileChange}
					accept="video/*"
					disabled={hasUploadedVideo}
				/>
				<input type="hidden" name="videourl" value={videoUrl} />
				<button
					className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
					title="動画をアップロードする"
					onClick={handleClickUpload}
					disabled={hasUploadedVideo}
				>
					動画を選択
					<br />
					<small>※アップロードできるファイルは100MBまでとなっています</small>
				</button>
			</div>
		)
	}
)

export default FileUploadButton
