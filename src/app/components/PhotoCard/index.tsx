import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PhotoCardProps {
	id: string
	title: string
	description: string
	imageUrl: string | null
	videoUrl: string | null
	createdAt: Date
	updatedAt: Date
	tags: { id: string; name: string }[]
}

const PhotoCard: React.FC<PhotoCardProps> = ({
	id,
	title,
	description,
	imageUrl,
	videoUrl,
	createdAt,
	updatedAt,
	tags
}) => {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="relative h-48">
				{imageUrl && <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="rounded-t-lg" />}
				{videoUrl && <video src={videoUrl} controls className="w-full h-full object-cover rounded-t-lg" />}
			</div>
			<div className="p-4">
				<Link href={`/photos/${id}`}>
					<a>
						<h3 className="text-lg font-semibold">{title}</h3>
					</a>
				</Link>
				<p className="text-gray-600">{description}</p>
				<div className="mt-2">
					{tags.map((tag) => (
						<span
							key={tag.id}
							className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
						>
							#{tag.name}
						</span>
					))}
				</div>
				<div className="mt-2 text-sm text-gray-500">
					<span>投稿日時: {createdAt.toLocaleString()}</span>
					{updatedAt && <span> (最終更新: {updatedAt.toLocaleString()})</span>}
				</div>
			</div>
		</div>
	)
}

export default PhotoCard
