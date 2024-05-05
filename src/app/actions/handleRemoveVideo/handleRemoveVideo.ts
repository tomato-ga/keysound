'use server'

import { PostFormData } from '../../../../types'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

interface RemoveVideoResult {
	success: boolean
	videourl: string | undefined
	message: string
}

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export const handleRemoveVideo = async (
	input: PostFormData | string | null | undefined
): Promise<RemoveVideoResult> => {
	let videourl: string | undefined
	try {
		videourl = typeof input === 'object' ? input?.videourl : input
		const videoKey = videourl?.split('/').pop()
		if (videoKey) {
			const objectKey = `${videoKey}`
			const deleteParams = {
				Bucket: process.env.R2_BUCKET_NAME,
				Key: objectKey
			}
			const result = await s3Client.send(new DeleteObjectCommand(deleteParams))
			console.log('Delete result:', JSON.stringify(result, null, 2))
			if (result.$metadata.httpStatusCode === 204) {
				console.log('動画を削除しました')
				return { success: true, videourl: '', message: '動画を削除しました' }
			} else {
				console.error('動画の削除に失敗しました')
				return { success: false, videourl: videourl, message: '動画の削除に失敗しました' }
			}
		} else {
			console.error('Error: Video URL is invalid')
			return { success: false, videourl: videourl, message: 'Video URL is invalid' }
		}
	} catch (error) {
		console.error('Error:', error)
		return { success: false, videourl: videourl, message: 'An unexpected error occurred' }
	}
}
