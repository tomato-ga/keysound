import React from 'react'
import { CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic'
const DynamicVideoPlayer = dynamic(() => import('../VideoPlayer'), { ssr: false })

interface PreviewSectionProps {
	videoUrl?: string
	isLoading: boolean
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ videoUrl, isLoading }) => {
	console.log('PreviewSection videoUrl:', videoUrl)

	const isYouTubeUrl = (url: string) => {
		const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
		return youtubeRegex.test(url)
	}

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-semibold mb-4 text-center">アップロードしたファイルのプレビュー</h2>
			{videoUrl && (
				<>
					{isYouTubeUrl(videoUrl) ? (
						<DynamicVideoPlayer videoUrl={videoUrl} controls={true} loop={true} />
					) : (
						<video controls src={videoUrl} className="max-w-full mx-auto mb-4" />
					)}
				</>
			)}
			{isLoading && (
				<div className="flex justify-center items-center mt-4">
					<CircularProgress />
				</div>
			)}
		</div>
	)
}

export default PreviewSection
