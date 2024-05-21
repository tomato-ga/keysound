import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

// S3クライアントを設定
const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

// POSTリクエストハンドラ
export async function POST(req: NextRequest) {
	try {
		// リクエストボディからURLを取得
		const { url } = await req.json()

		if (!url) {
			console.error('URLが指定されていません')
			return NextResponse.json({ error: 'URL is required' }, { status: 400 })
		}

		// サムネイル画像を取得
		const response = await fetch(url)
		if (!response.ok) {
			console.error('サムネイル画像の取得に失敗しました', response.statusText)
			return NextResponse.json({ error: 'Failed to fetch thumbnail' }, { status: response.status })
		}
		const arrayBuffer = await response.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const fileName = `thumbnails/${url.split('/').pop()}.jpg` // ファイル拡張子を追加

		// S3にサムネイル画像をアップロード
		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: fileName,
			Body: buffer,
			ContentType: 'image/jpeg'
		})

		await s3Client.send(command)

		// アップロードされたサムネイルURLを生成
		const thumbnailUrl = `https://${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com/${fileName}`
		console.log('サムネイルのアップロードに成功しました', thumbnailUrl)
		return NextResponse.json({ thumbnailUrl }, { status: 200 })
	} catch (error) {
		console.error('サムネイルのアップロードに失敗しました', error)
		return NextResponse.json({ error: 'Failed to upload thumbnail' }, { status: 500 })
	}
}
