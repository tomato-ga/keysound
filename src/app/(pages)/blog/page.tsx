import Link from 'next/link'
import blogdata from '/Users/ore/Documents/GitHub/keysound/blog-data.json'

interface TBlog {
	id: string
	title: string
	content: string
}

const getBlogData = async () => {
	const res = await fetch('http://localhost:3000/api/blog', { cache: 'no-store' })
	const blogData = await res.json()
	return blogData
}

const BlogPage = async () => {
	const blogData = await getBlogData()

	return (
		<div className="container mx-auto py-[50px]">
			<div className="grid grid-cols-12 gap-3">
				{blogdata.map((blog: TBlog) => (
					<div className="col-span-4 border border-black rounded p-5" key={blog.id}>
						<Link href={`/blog/${blog.id}`} className="w-full">
							{blog.title}
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}

export default BlogPage
