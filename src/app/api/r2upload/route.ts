// /Users/donbe/Codes/keysound/src/app/api/r2upload/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function GET(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File | null

		if (!file) {
			return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
		}

		const now = new Date()
		const formattedDate = now.toISOString().split('T')[0]
		const encodedFileName = encodeURIComponent(file.name)
		const objectKey = `uploads/${formattedDate}_${encodedFileName}`

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: objectKey,
			ContentType: file.type // Set content type based on the file type
		})

		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // Generate a signed URL valid for 1 hour

		return NextResponse.json({ url }, { status: 200 })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
