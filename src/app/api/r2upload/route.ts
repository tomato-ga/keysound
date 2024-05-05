// /Users/ore/Documents/GitHub/keysound/src/app/api/s3upload/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

require('dotenv').config()

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
			console.log('ファイルがアップロードされていません。')
			return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
		}

		const now = new Date()
		const formattedDate = now.toISOString().split('T')[0]
		const encodedFileName = encodeURIComponent(file.name)
		const objectKey = `${formattedDate}_${encodedFileName}` // 'uploads/' を削除

		const fileStream = file.stream()

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: process.env.R2_BUCKET_NAME!,
				Key: objectKey,
				Body: fileStream
			},
			leavePartsOnError: false
		})

		const uploadResult = await upload.done()

		const url = `https://gravuregazo.com/${encodeURIComponent(objectKey)}`
		console.log('アップロード結果:', uploadResult)
		console.log('生成されたURL:', url)

		return NextResponse.json({ url })
	} catch (error) {
		console.error('エラーが発生しました:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
