/**
 * TypeScript React の `DynamicVideoPlayer` コンポーネントは、`react-player` ライブラリを使用して、動的 URL
 * とレスポンシブなスタイルを備えたビデオ プレーヤーをレンダリングします。
 * @param  - 提供されている TypeScript React コードの `DynamicVideoPlayer` コンポーネントは、動的な URL とレスポンシブなスタイルを使用してビデオ
 * プレーヤーをレンダリングします。
 */

// /Users/ore/Documents/GitHub/keysound/src/app/components/VideoPlayer/index.tsx
'use client'
import ReactPlayer from 'react-player/lazy'

interface DynamicVideoPlayerProps {
	videoUrl: string
	controls?: boolean
	loop?: boolean
}

// TODO playingを修正する -> モバイル表示の時に勝手に再生されたらデータ消費してしまうため、モバイルはデフォルトfalseにする。WiFi接続状態を確認できた場合はtrueにできる？
const DynamicVideoPlayer = ({ videoUrl, controls, loop }: DynamicVideoPlayerProps) => {
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
			loop={loop}
			playsinline={true}
		/>
	)
}

export default DynamicVideoPlayer
