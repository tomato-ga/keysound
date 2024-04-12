// DynamicVideoPlayer.tsx
'use client'
import { FC } from 'react'
import ReactPlayer from 'react-player'

interface DynamicVideoPlayerProps {
	videoUrl: string
}

const DynamicVideoPlayer: FC<DynamicVideoPlayerProps> = ({ videoUrl }) => {
	return <ReactPlayer url={videoUrl} controls width="100%" height="auto" className="w-full h-48 md:h-64 object-cover" />
}

export default DynamicVideoPlayer
