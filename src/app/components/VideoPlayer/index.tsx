/**
 * TypeScript React の `DynamicVideoPlayer` コンポーネントは、動的な URL とレスポンシブなスタイルを備えたビデオ プレーヤーをレンダリングします。
 * @param  - `DynamicVideoPlayer.tsx` ファイルは、`react-player` ライブラリの `ReactPlayer` コンポーネントを使用してビデオ
 * プレーヤーをレンダリングする TypeScript React コンポーネントです。
 */

// /Users/ore/Documents/GitHub/keysound/src/app/components/VideoPlayer/index.tsx
'use client'
import { FC } from 'react'
import ReactPlayer from 'react-player/lazy'

interface DynamicVideoPlayerProps<T extends boolean> {
	videoUrl: string
	controls?: T
}

const DynamicVideoPlayer = <T extends boolean = false>({ videoUrl, controls }: DynamicVideoPlayerProps<T>) => {
	return <ReactPlayer url={videoUrl} width="100%" height="auto" className="w-full object-cover" controls={controls} />
}

export default DynamicVideoPlayer
