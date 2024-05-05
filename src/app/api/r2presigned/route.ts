// /Users/donbe/Codes/keysound/src/app/api/r2presigned/route.ts
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

export async function GET(req: NextRequest, res: NextResponse) {
	if (req.method !== 'GET') {
		return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
	}
	const searchParams = req.nextUrl.searchParams
	const paramsFileName = searchParams.get('fileName')

	console.log('file', paramsFileName)

	if (!searchParams) {
		return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
	}

	const objectKey = `uploads/${paramsFileName}`

	try {
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: objectKey,
			ContentType: 'application/octet-stream'
		})
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

		
		return NextResponse.json({ url }, { status: 200 })
	} catch (error) {
		console.error('エラーが発生しましたError generating signed URL:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
