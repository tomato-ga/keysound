import { useCallback } from 'react'

const useThumbnailUpload = async (url: string): Promise<string> => {
	const response = await fetch('/api/r2thumb', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ url })
	})
	const data = await response.json()
	if (!response.ok) {
		// throw new Error(data.error || 'Failed to upload thumbnail')
	}
	return data.thumbnailUrl
}

export default useThumbnailUpload
