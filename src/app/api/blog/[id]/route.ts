import { NextResponse, NextRequest } from 'next/server'
import blogdata from '/Users/ore/Documents/GitHub/keysound/blog-data.json'

const GET = (req: NextRequest, { params }: { params: { id: string } }) => {
	const { id } = params
	const blogArticle = blogdata.find((blog) => blog.id === id)
	if (!blogArticle) {
		return NextResponse.json({}, { status: 404 })
	}

	return NextResponse.json(blogArticle, { status: 200 })
}

export { GET }
