// /Users/donbe/Codes/keysound/src/app/api/r2upload/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function PUT(request: NextRequest) {
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

		const uploadParams = {
			Bucket: process.env.R2_BUCKET_NAME,
			Key: objectKey,
			Body: file.stream(), // Use the file stream directly for upload
			ContentType: file.type // Set the content type based on the file type
		}

		await s3Client.send(new PutObjectCommand(uploadParams))

		const url = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`
		return NextResponse.json({ message: 'File uploaded successfully', url }, { status: 200 })
	} catch (error) {
		console.error('Error uploading file:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
