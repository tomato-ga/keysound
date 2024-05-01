'use client'
import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player/lazy'

interface DynamicVideoPlayerProps {
	videoUrl: string
	controls?: boolean
	loop?: boolean
}

const DynamicVideoPlayer = ({ videoUrl, controls, loop }: DynamicVideoPlayerProps) => {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768) // 画面幅が768px以下をモバイルとみなす
		}

		window.addEventListener('resize', handleResize)
		handleResize() // 初回レンダリング時に画面幅を判定

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<ReactPlayer
			url={videoUrl}
			width="100%"
			height="auto"
			className="w-full object-cover"
			controls={controls}
			volume={0}
			muted={true}
			playing={!isMobile} // モバイルの場合はplayingをfalseに設定
			loop={loop}
			playsinline={true}
		/>
	)
}

export default DynamicVideoPlayer
