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
		const fileBuffer = await file.arrayBuffer()
		const fileStream = new Uint8Array(fileBuffer)

		const uploadParams = {
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: `uploads/${formattedDate}_${file.name}`,
			Body: fileStream
		}

		console.log('アップロードパラメータ:', uploadParams)

		const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams))

		console.log('アップロード結果:', uploadResult)

		const url = `https://data.keyboard-sound.net/${uploadParams.Key}`

		// TODO アップロード後の管理画面URL https://data.keyboard-sound.net/uploads%2F2024-05-04_y2mate.is%20-%20The%20Mode%20x%20Alexotos%20Collaboration!-aA_U_A5x-dc-360p-1713274171.mp4
		// TODO 生成されたURL: https://data.keyboard-sound.net/uploads/2024-05-04_y2mate.is - The Mode x Alexotos Collaboration!-aA_U_A5x-dc-360p-1713274171.mp4
		//  TODO アクセスしたURL https://data.keyboard-sound.net/uploads/2024-05-04_y2mate.is
		// TODO 全部URLが違う！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！1
		console.log('生成されたURL:', url)

		return NextResponse.json({ url })
	} catch (error) {
		console.error('エラーが発生しました:', error)
		return NextResponse.json({ error: 'Server Error: Unable to process the request.' }, { status: 500 })
	}
}
