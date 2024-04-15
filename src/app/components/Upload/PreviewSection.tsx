import React from 'react'
import { CircularProgress } from '@mui/material'

interface PreviewSectionProps {
	videoUrl?: string
	// imageUrls: string[]
	isLoading: boolean
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ videoUrl, isLoading }) => {
	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold mb-4 text-center">アップロードしたファイルのプレビュー</h2>
			{videoUrl && (
				<>
					<video controls src={videoUrl} className="max-w-full mx-auto mb-4" />
				</>
			)}
			{/* 2024/04/15 画像アップロードはしないように変更 {imageUrls.map((imageUrl, index) => (
				<img key={index} src={imageUrl} alt={`Uploaded Image ${index + 1}`} className="max-w-full mx-auto mb-4" />
			))} */}

			{isLoading && (
				<div className="flex justify-center items-center mt-4">
					<CircularProgress />
				</div>
			)}
		</div>
	)
}

export default PreviewSection
