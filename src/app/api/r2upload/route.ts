// /Users/ore/Documents/GitHub/keysound/src/app/api/s3upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
require('dotenv').config()

// export const config = {
// 	api: {
// 		bodyParser: false
// 	}
// }

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File | null

		if (!file) {
			return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
		}

		const now = new Date()
		const formattedDate = now.toISOString().split('T')[0]
		const encodedFileName = encodeURIComponent(file.name)
		const fileBuffer = await file.arrayBuffer()
		const fileStream = new Uint8Array(fileBuffer)

		const uploadParams = {
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: `uploads/${formattedDate}_${encodedFileName}`,
			Body: fileStream
		}

		const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams))
		console.log('Upload Result:', uploadResult)

		const url = `https://data.keyboard-sound.net/${uploadParams.Key}`
		console.log(url)

		return NextResponse.json({ url })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
