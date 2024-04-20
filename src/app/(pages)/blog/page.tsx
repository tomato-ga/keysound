import Link from "next/link";

interface TBlog {
	id: string;
	title: string;
	content: string;
}

const blogdata = [
	{
		id: "1",
		title: "Nextjsを勉強しました!",
		content: "今日はZennの本を読んで、Nextjsを学びました。",
	},
	{
		id: "2",
		title: "カレーライスを食べました!",
		content: "今日は休みだったので、家でカレーライスを作りました。",
	},
	{
		id: "3",
		title: "パソコンを買い換えました。",
		content: "昔から使っていたwindowsが壊れたので、macに買い換えました。",
	},
	{ id: "4", title: "ページレンダリング", content: "SSR, SSG, ISRを学んだ。" },
	{
		id: "5",
		title: "SSR, SSG, ISRの違いが理解できた。",
		content: "SSR, SSG, ISRでブログを作ることに違いを理解できた。",
	},
];

const getBlogData = async () => {
	const res = await fetch("http://localhost:3000/api/blog", {
		cache: "no-store",
	});
	const blogData = await res.json();
	return blogData;
};

const BlogPage = async () => {
	const blogData = await getBlogData();

	return (
		<div className="container mx-auto py-[50px]">
			<div className="grid grid-cols-12 gap-3">
				{blogdata.map((blog: TBlog) => (
					<div
						className="col-span-4 border border-black rounded p-5"
						key={blog.id}
					>
						<Link href={`/blog/${blog.id}`} className="w-full">
							{blog.title}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default BlogPage;
