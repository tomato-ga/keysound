import { prisma } from '@/app/lib/prisma'
import AdminLayout from './layout'
import Link from 'next/link'

// TODO　まだデータない 記事ステータスを下書きできるようにする
const AdminPostLists = async () => {
	const postLists = await prisma.blog.findMany({
		orderBy: { createdAt: 'desc' },
		select: { id: true, title: true, tags: true, updatedAt: true, createdAt: true }
	})

	// console.log('postLists', postLists)

	const formatDate = (dateString: Date) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	return (
		// <AdminLayout>
		<div className="postlists">
			{postLists.map((post) => (
				<div className="flex items-center justify-center" key={post.id}>
					<ul>
						<li className="m-3 text-4xl text-slate-700">
							<Link href={`/adminu/${post.id}`}>
								<h2>{post.title}</h2>
								<p className="text-sm">タグ：{post.tags}</p>

								<div className="text-sm">更新：{formatDate(post.updatedAt)}</div>
								<div className="text-sm">公開：{formatDate(post.createdAt)}</div>
							</Link>
						</li>
					</ul>
				</div>
			))}
		</div>
		// </AdminLayout>
	)
}

export default AdminPostLists
