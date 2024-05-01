// /Users/ore/Documents/GitHub/keysound/src/app/api/r2delete/route.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
require('dotenv').config()

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
	}
})

export async function DELETE(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const query = searchParams.get('query')

	console.log('searchParams', searchParams)
	console.log('query', query)

	if (!query) {
		return NextResponse.json({ error: 'Queryが見つかりません' }, { status: 400 })
	}

	if (typeof query !== 'string') {
		return NextResponse.json({ error: 'Queryが無効です' }, { status: 400 })
	}

	try {
		const deleteParams = {
			Bucket: process.env.R2_BUCKET_NAME,
			Key: query
		}

		const result = await s3Client.send(new DeleteObjectCommand(deleteParams))
		console.log('Delete result:', JSON.stringify(result, null, 2)) // 結果の詳細をJSON形式でログ出力
		return NextResponse.json({ message: '動画を削除しました' }, { status: 200 })
	} catch (e) {
		console.error(e)
		return NextResponse.json({ message: '動画削除に失敗しました' }, { status: 500 })
	}
}
