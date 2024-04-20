// /Users/ore/Documents/GitHub/keysound/src/app/api/s3upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

require("dotenv").config();

export const config = {
	api: {
		bodyParser: false,
	},
};

// TODO 2024/04/12 cloudflare R2にして、転送量削減する , 遅いけどまぁしゃあない

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	throw new Error("AWS KEY is not found");
}

const s3Client = new S3Client({
	region: "ap-northeast-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
		}

		// ファイル名に日付を追加する
		const now = new Date();
		const formattedDate = now.toISOString().split("T")[0];

		const fileBuffer = await file.arrayBuffer();
		const fileStream = new Uint8Array(fileBuffer);
		const uploadParams = {
			Bucket: "keysound",
			Key: `uploads/${formattedDate}_${file.name}`,
			Body: fileStream,
		};
		await s3Client.send(new PutObjectCommand(uploadParams));
		const url = `https://keysound.s3.ap-northeast-1.amazonaws.com/${uploadParams.Key}`;
		console.log(url);

		return NextResponse.json({ url });
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Server Error: Unable to process the request." },
			{ status: 500 },
		);
	}
}
