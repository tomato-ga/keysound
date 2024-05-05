// /Users/donbe/Codes/keysound/src/app/api/r2upload/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// AWS SDKのS3Clientを設定（Cloudflare R2はAWS S3と互換性がある）
const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Cloudflare R2のエンドポイント
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function POST(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method Not Allowed' })
	}

	const { fileName } = req.query as { fileName: string }

	try {
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: fileName,
			ContentType: 'application/octet-stream' // 適切なContent-Typeを設定
		})

		// URLの有効期限を1時間に設定
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

		res.status(200).json({ url })
	} catch (error) {
		console.error('Failed to create presigned URL:', error)
		res.status(500).json({ error: 'Failed to create presigned URL' })
	}
}
