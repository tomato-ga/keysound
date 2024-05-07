import { generateThumbnail } from './thumbnail'
import { saveToR2, getR2Url } from './r2'
import { saveToDatabase } from './database'

export async function generateAndSaveThumbnail(videoUrl: string, videoId: string): Promise<void> {
	const response = await fetch(videoUrl)
	const videoStream = response.body

	const thumbnailBuffer = await generateThumbnail(videoStream)
	const thumbnailKey = `${videoId}_thumbnail.jpg`
	await saveToR2(thumbnailBuffer, thumbnailKey)
	const thumbnailUrl = getR2Url(thumbnailKey)
	await saveToDatabase(videoId, thumbnailKey, thumbnailUrl)
}
