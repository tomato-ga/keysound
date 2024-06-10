import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	try {
		const { url } = await req.json()
		const fileName = url.split('/').pop()

		const command = new DeleteObjectCommand({
			Bucket: process.env.R2_BLOGTHUMB_BUCKET_NAME!,
			Key: fileName
		})

		await s3Client.send(command)
		return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 })
	} catch (error: any) {
		return NextResponse.json({ error: `Failed to delete image: ${error.message}` }, { status: 500 })
	}
}
