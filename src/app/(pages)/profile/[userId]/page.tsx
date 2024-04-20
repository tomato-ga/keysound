// src/app/(pages)/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/[...nextauth]";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import ProfilePanel from "@/app/components/ProfilePanel";
import PostsCard from "@/app/components/PostsCard";

import { truncateDescription, formatDate } from "@/app/func/postFunc";

export default async function ProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.name) {
		return (
			<div className="text-red-500">ユーザーセッションが見つかりません</div>
		);
	}

	const profile = await prisma.profile.findFirst({
		where: { user: { name: session.user.name } },
		include: {
			user: {
				include: {
					posts: {
						include: {
							user: true,
						},
					},
				},
			},
		},
	});

	if (!profile) {
		return <div className="text-red-500">Profile not found</div>;
	}

	console.log("profile", profile.user.posts);

	return (
		<div className="bg-white">
			<div className="container mx-auto px-4 py-8">
				<ProfilePanel profile={profile} />
				<Link href={`/profile/${profile.user.id}/edit`}>
					<button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
						プロフィールを編集
					</button>
				</Link>
				<h2 className="mt-8 mb-4 text-2xl font-bold">投稿一覧</h2>
				<PostsCard posts={profile.user.posts} componentType="profile" />
			</div>
		</div>
	);
}
