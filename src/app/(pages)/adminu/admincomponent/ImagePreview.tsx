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

	return (
		<div className="image-preview-container">
			{thumbUrl && (
				<div className="image-preview-item">
					<img src={thumbUrl} alt="Thumbnail Preview" className="image-preview" />
					<button onClick={() => handleDelete(thumbUrl)} className="image-delete-button">
						削除
					</button>
				</div>
			)}
			{imageUrls.map((url, index) => (
				<div key={index} className="image-preview-item">
					<img src={url} alt={`Preview ${index + 1}`} className="image-preview" />
					<button onClick={() => handleDelete(url)} className="image-delete-button">
						削除
					</button>
				</div>
			))}
		</div>
	)
}

export default ImagePreview
