import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { File as FormidableFile } from 'formidable'

require('dotenv').config()

export const config = {
	api: {
		bodyParser: false
	}
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	throw new Error('AWS KEY is not found')
}

const s3Client = new S3Client({
	region: 'ap-northeast-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' })
		return
	}

	try {
		const data = await new Promise<{ files: FormidableFile[] }>((resolve, reject) => {
			const form = new IncomingForm()
			form.parse(req, (err, fields, files) => {
				if (err) {
					reject(err)
				} else {
					resolve({ files: (files.files as FormidableFile[]) || [] })
				}
			})
		})

		if (!data.files || data.files.length === 0) {
			res.status(400).json({ error: 'No files uploaded.' })
			return
		}

		const uploadedFiles = data.files
		const uploadPromises = uploadedFiles.map(async (file) => {
			const fileStream = await fs.readFile(file.filepath)
			const uploadParams = {
				Bucket: 'keysound',
				Key: `uploads/${Date.now()}_${file.originalFilename}`,
				Body: fileStream
			}
			const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams))
			return `https://${uploadParams.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uploadParams.Key}`
		})

		const urls = await Promise.all(uploadPromises)
		res.status(200).json({ urls })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).json({ error: 'Server Error: Unable to process the request.' })
	}
}
