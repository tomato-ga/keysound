// /Users/don/Codes/keysound/src/app/api/db/userSave/route.ts

// Route Handler
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { cache } from "react";

export const POST = cache(async (req: NextRequest) => {
	const body = await req.json();
	console.log("API呼び出し:", body);

	if (req.method === "POST") {
		const { name, email, image } = body;

		try {
			// ユーザーの存在チェック
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (!existingUser) {
				// ユーザーが存在しない場合は新規作成
				const user = await prisma.user.create({
					data: {
						name,
						email,
						image,
						profile: {
							create: {
								screenName: name, // screenNameをnameと同じ値に設定
							},
						},
					},
					include: {
						profile: true, // 作成されたProfileも取得
					},
				});
				return Response.json({ message: "DB保存成功", user }, { status: 200 });
			} else {
				// ユーザーが既に存在する場合
				return Response.json(
					{ message: "ユーザーは既に存在します" },
					{ status: 400 },
				);
			}
		} catch (error: any) {
			console.error("エラー:", error);

			// 既存の接続を切断
			await prisma.$disconnect();

			return Response.json(
				{
					message: "サーバーエラー",
					error: error.message, // エラーメッセージをクライアントに送信
					type: error.constructor.name, // エラーの種類を送信
				},
				{ status: 500 },
			);
		}
	}
});
