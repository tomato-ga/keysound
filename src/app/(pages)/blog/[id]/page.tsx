import NotFound from "@/app/not-found";

const getBlogArticle = async (id: string) => {
	const res = await fetch(`http://localhost:3000/api/blog/${id}`);
	const blogArticle = await res.json();

	if (res.status === 404) {
		return "NotFound";
	}

	return blogArticle;
};

const BlogArticlePage = async ({ params }: { params: { id: string } }) => {
	const blogArticle = await getBlogArticle(params.id);

	if (blogArticle === "NotFound") {
		return <NotFound />;
	}

	return (
		<div className="container mx-auto py-5">
			<h2 className="text-[50px]">{blogArticle.title}</h2>
			<p>{blogArticle.content}</p>
		</div>
	);
};

export default BlogArticlePage;
