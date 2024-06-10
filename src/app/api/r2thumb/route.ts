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

const CUSTOM_DOMAIN = 'https://blogimg.keyboard-sound.net'

function createErrorResponse(message: string, status: number): NextResponse {
	console.error(message)
	return NextResponse.json({ error: message }, { status })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const formData = await req.formData()
		const file = formData.get('file') as Blob

		if (!file) {
			return createErrorResponse('ファイルが必要です', 400)
		}

		const buffer = Buffer.from(await file.arrayBuffer())
		const jpegBuffer = await sharp(buffer).jpeg().toBuffer()
		const fileName = `${uuidv4()}.jpg`

		console.log(`Uploading file: ${fileName}, Content-Type: image/jpeg`)

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BLOGTHUMB_BUCKET_NAME!,
			Key: fileName,
			Body: jpegBuffer,
			ContentType: 'image/jpeg'
		})

		await s3Client.send(command)

		const uploadedThumbnailUrl = `${CUSTOM_DOMAIN}/${fileName}`
		console.log('Successfully uploaded thumbnail:', uploadedThumbnailUrl)

		return NextResponse.json({ thumbnailUrl: uploadedThumbnailUrl }, { status: 200 })
	} catch (error: any) {
		return createErrorResponse(`サムネイルのアップロードに失敗しました: ${error.message}`, 500)
	}
}
