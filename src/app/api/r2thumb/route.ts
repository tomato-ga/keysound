import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

const CUSTOM_DOMAIN = 'https://img.keyboard-sound.net'

function sanitizeFileName(fileName: string): string {
	return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
}

function getFileExtension(contentType: string): string {
	const extensionMap: { [key: string]: string } = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif'
	}
	return extensionMap[contentType] || 'jpg'
}

async function fetchContentType(url: string): Promise<string> {
	const response = await fetch(url, { method: 'HEAD' })
	if (!response.ok) {
		throw new Error(`画像メタデータのフェッチに失敗しました: ${response.status}`)
	}
	const contentType = response.headers.get('content-type') ?? 'image/jpeg'
	console.log(`取得したContent-Type: ${contentType}`)
	return contentType
}

async function uploadThumbnail(url: string, fileName: string, contentType: string): Promise<string> {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`画像のフェッチに失敗しました: ${response.status}`)
	}

	const arrayBuffer = await response.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)
	console.log(`アップロード中のファイル: ${fileName}, Content-Type: ${contentType}`)

	const command = new PutObjectCommand({
		Bucket: process.env.R2_THUMB_BUCKET_NAME!,
		Key: fileName,
		Body: buffer,
		ContentType: contentType
	})

	await s3Client.send(command)
	return `${CUSTOM_DOMAIN}/${fileName}`
}

export async function POST(req: NextRequest) {
	try {
		const { url } = await req.json()
		if (!url) {
			const errorMessage = 'URLは必須です'
			console.error(errorMessage)
			return NextResponse.json({ error: errorMessage }, { status: 400 })
		}

		const contentType = await fetchContentType(url)
		const extension = getFileExtension(contentType)
		const fileName = `${sanitizeFileName(url.split('/').pop()!)}.${extension}`

		const thumbnailUrl = await uploadThumbnail(url, fileName, contentType)
		console.log('サムネイルのアップロードに成功しました:', thumbnailUrl)

		return NextResponse.json({ thumbnailUrl }, { status: 200 })
	} catch (error: any) {
		const errorMessage = `サムネイルのアップロードに失敗しました: ${error.message}`
		console.error(errorMessage)
		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
