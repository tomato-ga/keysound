import { useState } from 'react'

const useThumbnailFileUpload = () => {
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

	const uploadThumbnail = async (file: File) => {
		setUploading(true)
		setError(null)

		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/r2blogthumb', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) {
				throw new Error('ファイルのアップロードに失敗しました')
			}

			const data = await response.json()
			setThumbnailUrl(data.thumbnailUrl)
		} catch (error: any) {
			setError(error.message)
		} finally {
			setUploading(false)
		}
	}

	return { uploading, error, thumbnailUrl, uploadThumbnail }
}

export default useThumbnailFileUpload
