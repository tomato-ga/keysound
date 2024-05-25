import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

function sanitizeFileName(fileName: string): string {
	return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
}

export async function POST(req: NextRequest) {
	try {
		console.log('Received request to upload thumbnail')

		const { url } = await req.json()
		if (!url) {
			console.error('URL is missing from request body')
			return NextResponse.json({ error: 'URL is required' }, { status: 400 })
		}

		console.log(`Fetching thumbnail from URL: ${url}`)
		const response = await fetch(url)
		if (!response.ok) {
			console.warn(`Failed to fetch thumbnail: ${response.status} ${response.statusText}`)
			return NextResponse.json({ error: 'Failed to fetch thumbnail' }, { status: response.status })
		}

		console.log('Thumbnail fetched successfully')
		const arrayBuffer = await response.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const fileName = `thumbnails/${sanitizeFileName(url.split('/').pop()!)}.jpg`
		console.log(`Uploading thumbnail to R2 with filename: ${fileName}`)

		const command = new PutObjectCommand({
			Bucket: process.env.R2_THUMB_BUCKET_NAME!,
			Key: fileName,
			Body: buffer,
			ContentType: 'image/jpeg'
		})

		await s3Client.send(command)

		const thumbnailUrl = `https://img.keyboard-sound.net/${fileName}`
		console.log(`Thumbnail uploaded successfully: ${thumbnailUrl}`)
		return NextResponse.json({ thumbnailUrl }, { status: 200 })
	} catch (error: any) {
		console.error('Failed to upload thumbnail:', error)
		return NextResponse.json({ error: 'Failed to upload thumbnail', details: error.message }, { status: 500 })
	}
}
