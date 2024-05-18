// Sidebar.tsx

import React from 'react'
import { prisma } from '../lib/prisma'
import Link from 'next/link'

const Sidebar: React.FC = async () => {
	const getParts = await prisma.part.findMany({
		include: { post: true },
		take: 10
	})

	console.log('getParts', getParts)

	return (
		<div className={`bg-white p-4 order-2 md:order-1 transform `}>
			<div className="text-black">
				{getParts.length > 0 ? (
					<ul>
						{getParts.map((part) => (
							<>
								<p>ケース</p>
								<li key={part.id}>
									<Link href={`/post/${part.post.id}`}>{part.case}</Link>
								</li>
							</>
						))}
					</ul>
				) : (
					'テスト'
				)}
			</div>
		</div>
	)
}

export default Sidebar
