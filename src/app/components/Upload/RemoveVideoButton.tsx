import React from 'react'

interface RemoveVideoButtonProps {
	onRemoveVideo: () => void
	hasUploadedVideo: boolean
}

const RemoveVideoButton: React.FC<RemoveVideoButtonProps> = ({ onRemoveVideo, hasUploadedVideo }) => {
	if (!hasUploadedVideo) {
		return null
	}

	return (
		<div className="mb-8 text-center">
			<button className="bg-red-600 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={onRemoveVideo}>
				動画を削除する
			</button>
		</div>
	)
}

export default RemoveVideoButton
