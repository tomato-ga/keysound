import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (req.method === "POST") {
		const { userId, screenName, bio } = body;

		try {
			const response = await prisma.profile.upsert({
				where: { id: userId },
				create: { screenName, bio, user: { connect: { id: userId } } },
				update: { screenName, bio },
			});

			return Response.json({ message: "処理OK", response }, { status: 200 });
		} catch (error) {
			return Response.json({ message: "処理NG", error }, { status: 500 });
		}
	}
	return Response.json({ error: "メソッドがPOSTじゃない" }, { status: 405 });
}
