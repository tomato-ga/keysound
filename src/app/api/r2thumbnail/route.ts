import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function saveToR2(thumbnailBuffer: ArrayBuffer, thumbnailKey: string): Promise<void> {
	const uploadParams = {
		Bucket: process.env.R2_BUCKET_NAME,
		Key: thumbnailKey,
		Body: Buffer.from(thumbnailBuffer),
		ContentType: 'image/jpeg'
	}

	try {
		await s3Client.send(new PutObjectCommand(uploadParams))
	} catch (error: any) {
		console.error('Error uploading thumbnail:', error)
		throw new Error(`Failed to save thumbnail to R2: ${error.message}`)
	}
}

export function getR2Url(thumbnailKey: string): string {
	return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${thumbnailKey}`
}
