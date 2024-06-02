import AdminLayout from './layout'
import Link from 'next/link'

// TODO　まだデータない 記事ステータスを下書きできるようにする
const AdminPostLists = () => {
	// useEffect(() => {
	// 	async function fetchData() {
	// 		try {
	// 			const response = await fetch('/api/admin_listposts', {
	// 				method: 'GET',
	// 				headers: { 'Content-Type': 'application/json' }
	// 			})
	// 			if (response.ok) {
	// 				const sqldata = await response.json()
	// 				setPostLists(sqldata.data)
	// 			} else {
	// 				console.error('Failed to fetch data:', response.status)
	// 			}
	// 		} catch (error) {
	// 			console.error('Error fetching data:', error)
	// 		}
	// 	}

	// 	fetchData()
	// }, [])

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	return 'hi'
	// <AdminLayout>
	// 	<div className="postlists">
	// 		{postLists.map((post) => (
	// 			<div className="flex items-center justify-center" key={post.id}>
	// 				<ul>
	// 					<li className="m-3 text-4xl text-slate-700">
	// 						<Link href={`/adminu/post/${post.id}`}>
	// 							{post.title}
	// 							<div className="text-2xl">更新日時：{formatDate(post.updated_at)}</div>
	// 							<div className="text-2xl">公開日時：{formatDate(post.created_at)}</div>
	// 						</Link>
	// 					</li>
	// 				</ul>
	// 			</div>
	// 		))}
	// 	</div>
	// </AdminLayout>
}

export default AdminPostLists
