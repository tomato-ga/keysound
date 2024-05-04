// /Users/ore/Documents/GitHub/keysound/src/app/api/s3upload/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
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

		console.log('アップロードされたファイル:', file.name)

		const now = new Date()
		const formattedDate = now.toISOString().split('T')[0]
		const encodedFileName = encodeURIComponent(file.name) // ファイル名をエンコード
		const objectKey = `uploads/${formattedDate}_${encodedFileName}` // パスのディレクトリ部分はエンコードしない

		const fileStream = file.stream() // Fileオブジェクトからストリームを取得

		const uploadParams = {
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: objectKey,
			Body: fileStream // ストリームをBodyに設定
		}

		console.log('アップロードパラメータ:', uploadParams)
		const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams))

		const url = `https://data.keyboard-sound.net/${objectKey}` // 正しいURLが生成される

		console.log('アップロード結果:', uploadResult)
		console.log('生成されたURL:', url)

		return NextResponse.json({ url })
	} catch (error) {
		console.error('エラーが発生しました:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
