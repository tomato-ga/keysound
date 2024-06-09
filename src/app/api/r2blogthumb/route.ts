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

const CUSTOM_DOMAIN = 'https://blogimg.keyboard-sound.net'

async function uploadImageToR2(buffer: Buffer, isWebp: boolean): Promise<string> {
	let webpBuffer: Buffer

	if (isWebp) {
		webpBuffer = buffer
	} else {
		webpBuffer = await sharp(buffer).webp().toBuffer()
	}

	const fileName = `${uuidv4()}.webp`
	const contentType = 'image/webp'

	console.log(`Uploading file: ${fileName}, Content-Type: ${contentType}`)

	const command = new PutObjectCommand({
		Bucket: process.env.R2_BLOGTHUMB_BUCKET_NAME!,
		Key: fileName,
		Body: webpBuffer,
		ContentType: contentType
	})

	await s3Client.send(command)
	return `${CUSTOM_DOMAIN}/${fileName}`
}

function createErrorResponse(message: string, status: number): NextResponse {
	console.error(message)
	return NextResponse.json({ error: message }, { status })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const formData = await req.formData()
		const file = formData.get('files') as Blob

		if (!file) {
			return createErrorResponse('File is required', 400)
		}

		const buffer = Buffer.from(await file.arrayBuffer())
		const fileType = file.type

		const isWebp = fileType === 'image/webp'
		const uploadedThumbnailUrl = await uploadImageToR2(buffer, isWebp)
		console.log('Successfully uploaded thumbnail:', uploadedThumbnailUrl)

		return NextResponse.json({ thumbnailUrl: uploadedThumbnailUrl }, { status: 200 })
	} catch (error: any) {
		return createErrorResponse(`Failed to upload thumbnail: ${error.message}`, 500)
	}
}
