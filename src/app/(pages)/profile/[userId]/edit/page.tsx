// /src/app/(pages)/profile/[userId]/edit/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/[...nextauth]";
import { prisma } from "@/app/lib/prisma";
import ProfileEditForm from "@/app/components/ProfileEditForm";
import { notFound } from "next/navigation";

interface EditProfilePageProps {
	params: { userId: string };
}

export default async function EditProfilePage({
	params,
}: EditProfilePageProps) {
	const userId = params.userId;

	if (!userId) {
		return (
			<div className="text-red-500">ユーザーセッションが見つかりません</div>
		);
	}

	const profile = await prisma.profile.findUnique({
		where: { userId: userId },
		include: { user: true },
	});

	if (!profile || !profile.user.name) {
		notFound();
	}

	return (
		<div className="bg-white min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8 text-gray-600">プロフィール編集</h1>
				<ProfileEditForm profile={profile} />
			</div>
		</div>
	);
}
