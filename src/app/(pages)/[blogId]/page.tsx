import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import MarkdownContent from '@/app/components/Markdowncontent'

interface PostContent {
	id: string
	title: string
	content: string
	created_at: string
	tags: string[]
}

interface PostPageProps {
	post: PostContent
}

const Post: React.FC<PostPageProps> = ({ post }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const day = date.getDate().toString().padStart(2, '0')
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${year}/${month}/${day} ${hours}:${minutes}`
	}

	const extractAsin = (value: string) => {
		if (!value) {
			return ''
		}
		return value.replace('ASIN#', '')
	}

	return (
		<>
			<div className="max-w-screen-md mx-auto">
				<div className="flex justify-center items-center m-6 text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 inline-block text-transparent bg-clip-text border-solid border-b border-gray-200 pb-4">
						{post.title}
					</h1>
				</div>

				<div className="m-6">
					<MarkdownContent markdownString={post.content} />
				</div>

				{/* インデックスの最新情報 */}
				<h2 className="text-gray-500 mt-3 mb-3 text-center text-2xl font-bold">最新セール情報</h2>
				<div className="h-0.5 bg-gradient-to-r from-[#d299c2] to-[#fef9d7] ml-10 mr-10"></div>
				<div className="flex flex-col md:flex-row bg-white p-4">
					{/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
						{latestsale.slice(0, 8).map((item, index) => (
							<div className="text text-black" key={index}>
								<Link href={`/items/${item.date}/${extractAsin(item.asin)}`} prefetch={false}>
									<div className="h-[270px] w-full md:h-[270px] md:w-full mb-4">
										<img
											src={item.imageUrl}
											alt={item.productName}
											className="w-full h-full"
											style={{ objectFit: 'contain' }}
										/>
									</div>
									<div className="mr-2 ml-2">
										<p>{item.productName.length > 80 ? `${item.productName.substring(0, 80)}...` : item.productName}</p>
									</div>
								</Link>
							</div>
						))}
					</div> */}
				</div>
			</div>
		</>
	)
}



export default Post
