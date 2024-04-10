import { NextResponse, NextRequest } from 'next/server'

const blogdata = [
	{ id: '1', title: 'Nextjsを勉強しました!', content: '今日はZennの本を読んで、Nextjsを学びました。' },
	{ id: '2', title: 'カレーライスを食べました!', content: '今日は休みだったので、家でカレーライスを作りました。' },
	{
		id: '3',
		title: 'パソコンを買い換えました。',
		content: '昔から使っていたwindowsが壊れたので、macに買い換えました。'
	},
	{ id: '4', title: 'ページレンダリング', content: 'SSR, SSG, ISRを学んだ。' },
	{
		id: '5',
		title: 'SSR, SSG, ISRの違いが理解できた。',
		content: 'SSR, SSG, ISRでブログを作ることに違いを理解できた。'
	}
]

const GET = (req: NextRequest, { params }: { params: { id: string } }) => {
	const { id } = params
	const blogArticle = blogdata.find((blog) => blog.id === id)
	if (!blogArticle) {
		return NextResponse.json({}, { status: 404 })
	}

	return NextResponse.json(blogArticle, { status: 200 })
}

export { GET }
