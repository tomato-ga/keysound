// /Users/ore/Documents/GitHub/keysound/src/app/(pages)/adminu/admincomponent/AdminHeader.tsx

'use client'

import React from 'react'
import Link from 'next/link'

const AdminHeader = () => {
	return (
		<header className="bg-gray-800 text-white p-4 flex justify-between items-center">
			<div className="flex-grow">
				<h1 className="text-lg md:text-xl inline mr-4">編集画面</h1>
				<Link href="/adminu/postlists">
					<span className="mr-4 cursor-pointer">ポスト一覧</span>
				</Link>
				<Link href="/adminu/newpost">
					<span className="cursor-pointer">新規投稿</span>
				</Link>
			</div>
		</header>
	)
}

export default AdminHeader
