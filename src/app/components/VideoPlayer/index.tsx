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
		<div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
			<ReactPlayer
				url={videoUrl}
				width="100%"
				height="100%"
				className="absolute top-0 left-0"
				controls={controls}
				volume={0}
				muted={true}
				playing={!isMobile} // モバイルの場合はplayingをfalseに設定
				loop={loop}
				playsinline={true}
			/>
		</div>
	)
}

export default DynamicVideoPlayer

