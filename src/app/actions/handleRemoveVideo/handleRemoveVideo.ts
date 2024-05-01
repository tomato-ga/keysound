'use server'
import { PostFormData } from '../../../../types'

export const handleRemoveVideo = async (postData: PostFormData) => {
	try {
		const videoKey = postData.videourl?.split('/').pop()
		if (videoKey) {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/api/r2delete?query=${encodeURIComponent(videoKey)}`
			const params = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}
			const response = await fetch(url, params)
			const data = await response.json()
			if (response.ok) {
				console.log(data.message)
				return { success: true, videourl: '' }
			} else {
				console.error('Error:', data.message || 'Unknown error occurred')
				return { success: false, videourl: postData.videourl, message: data.message || 'Unknown error occurred' }
			}
		} else {
			console.error('Error: Video URL is invalid')
			return { success: false, videourl: postData.videourl, message: 'Video URL is invalid' }
		}
	} catch (error) {
		console.error('Error:', error)
		return { success: false, videourl: postData.videourl, message: 'An unexpected error occurred' }
	}
}
