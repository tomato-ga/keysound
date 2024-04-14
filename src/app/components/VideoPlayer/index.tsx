/**
 * TypeScript React の `DynamicVideoPlayer` コンポーネントは、動的な URL とレスポンシブなスタイルを備えたビデオ プレーヤーをレンダリングします。
 * @param  - `DynamicVideoPlayer.tsx` ファイルは、`react-player` ライブラリの `ReactPlayer` コンポーネントを使用してビデオ
 * プレーヤーをレンダリングする TypeScript React コンポーネントです。
 */

// /Users/ore/Documents/GitHub/keysound/src/app/components/VideoPlayer/index.tsx
'use client'
import { FC } from 'react'
import ReactPlayer from 'react-player'

interface DynamicVideoPlayerProps {
	videoUrl: string
}

const DynamicVideoPlayer: FC<DynamicVideoPlayerProps> = ({ videoUrl }) => {
	return <ReactPlayer url={videoUrl} width="100%" height="180px" className="w-full object-cover" />
}

export default DynamicVideoPlayer
