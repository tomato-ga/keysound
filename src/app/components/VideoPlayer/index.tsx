/**
 * TypeScript React の `DynamicVideoPlayer` コンポーネントは、`react-player` ライブラリを使用して、動的 URL
 * とレスポンシブなスタイルを備えたビデオ プレーヤーをレンダリングします。
 * @param  - 提供されている TypeScript React コードの `DynamicVideoPlayer` コンポーネントは、動的な URL とレスポンシブなスタイルを使用してビデオ
 * プレーヤーをレンダリングします。
 */

// /Users/ore/Documents/GitHub/keysound/src/app/components/VideoPlayer/index.tsx
'use client'
import ReactPlayer from 'react-player/lazy'

interface DynamicVideoPlayerProps<T extends boolean> {
	videoUrl: string
	controls?: T
}

const DynamicVideoPlayer = <T extends boolean = false>({ videoUrl, controls }: DynamicVideoPlayerProps<T>) => {
	return (
		<ReactPlayer
			url={videoUrl}
			width="100%"
			height="auto"
			className="w-full object-cover"
			controls={controls}
			volume={0}
			muted={true}
			playing={true}
		/>
	)
}

export default DynamicVideoPlayer
