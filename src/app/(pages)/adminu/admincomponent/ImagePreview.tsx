import React from 'react'

interface ImagePreviewProps {
	imageUrls: string[]
	thumbUrl: string
	onDelete: (url: string) => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrls, thumbUrl, onDelete }) => {
	const handleDelete = async (url: string) => {
		try {
			const response = await fetch('/api/r2blogdeleteImage', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			})

			if (!response.ok) {
				const errorData = await response.json()
				console.error('Failed to delete image:', errorData.error)
				return
			}

			onDelete(url)
		} catch (error) {
			console.error('Error deleting image:', error)
		}
	}

	const getFileName = (url: string) => {
		return url.split('/').pop() || 'Unknown'
	}

	return (
		<div className="flex flex-col gap-4">
			{thumbUrl && (
				<div className="flex flex-col items-center">
					<img src={thumbUrl} alt="Thumbnail Preview" className="max-w-full h-auto" />
					<div className="flex justify-between items-center w-full mt-2">
						<span className="mr-4">{getFileName(thumbUrl)}</span>
						<button onClick={() => handleDelete(thumbUrl)} className="bg-red-500 text-white px-4 py-2 rounded">
							削除
						</button>
					</div>
				</div>
			)}
			{imageUrls.map((url, index) => (
				<div key={index} className="flex flex-col items-center">
					<img src={url} alt={`Preview ${index + 1}`} className="max-w-full h-auto" />
					<div className="flex justify-between items-center w-full mt-2">
						<span className="mr-4">{getFileName(url)}</span>
						<button onClick={() => handleDelete(url)} className="bg-red-500 text-white px-4 py-2 rounded">
							削除
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default ImagePreview
