// src/app/page.tsx
import Link from "next/link";
import { prisma } from "./lib/prisma";
import PostsCard from "./components/PostsCard";
import { Post } from "../../types";

export default async function Home() {
	const posts = await prisma.post.findMany({
		orderBy: { createdat: "desc" },
		include: { user: true },
	});

	return (
		<div className="home">
			<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
				<PostsCard posts={posts} componentType="top" isCurrentUser={false} />
			</div>
		</div>
	);
}
