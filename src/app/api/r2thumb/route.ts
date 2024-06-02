import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

console.log('R2_THUMB_BUCKET_NAME:', process.env.R2_THUMB_BUCKET_NAME)

const CUSTOM_DOMAIN = 'https://img.keyboard-sound.net'

async function fetchImage(url: string): Promise<Buffer> {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`Failed to fetch the image: ${response.status} ${response.statusText}`)
	}

	const contentType = response.headers.get('content-type')
	if (!contentType || !contentType.startsWith('image/')) {
		throw new Error('Fetched content is not an image')
	}

	const arrayBuffer = await response.arrayBuffer()
	return Buffer.from(arrayBuffer)
}

async function uploadImageToR2(url: string): Promise<string> {
	const buffer = await fetchImage(url)

	const jpegBuffer = await sharp(buffer).jpeg().toBuffer()

	const fileName = `${uuidv4()}.jpg`
	const contentType = 'image/jpeg'

	console.log(`Uploading file: ${fileName}, Content-Type: ${contentType}`)

	const command = new PutObjectCommand({
		Bucket: process.env.R2_THUMB_BUCKET_NAME!,
		Key: fileName,
		Body: jpegBuffer,
		ContentType: contentType
	})

	await s3Client.send(command)
	return `${CUSTOM_DOMAIN}/${fileName}`
}

function extractYouTubeVideoId(url: string): string | null {
	const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	const match = url.match(regExp)
	return match ? match[1] : null
}

function getYouTubeThumbnailUrl(videoId: string): string {
	return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

function createErrorResponse(message: string, status: number): NextResponse {
	console.error(message)
	return NextResponse.json({ error: message }, { status })
}

// TODO サムネイル保存されていない
export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const { url } = await req.json()

		if (!url) {
			return createErrorResponse('URL is required', 400)
		}

		const videoId = extractYouTubeVideoId(url)
		if (!videoId) {
			return createErrorResponse('Invalid YouTube URL', 400)
		}

		const thumbnailUrl = getYouTubeThumbnailUrl(videoId)
		console.log(`Fetching thumbnail from YouTube: ${thumbnailUrl}`)

		const uploadedThumbnailUrl = await uploadImageToR2(thumbnailUrl)
		console.log('Successfully uploaded thumbnail:', uploadedThumbnailUrl)

		return NextResponse.json({ thumbnailUrl: uploadedThumbnailUrl }, { status: 200 })
	} catch (error: any) {
		return createErrorResponse(`Failed to upload thumbnail: ${error.message}`, 500)
	}
}
