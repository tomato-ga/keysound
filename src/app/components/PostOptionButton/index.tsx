'use client'
import { useState } from 'react'
import Link from 'next/link'

type PostOptionsButtonProps = {
	postId: string
	screenName: string | null | undefined
}

export default function PostOptionsButton({ postId, screenName }: PostOptionsButtonProps) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleOptions = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div className="relative">
			<button
				className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 rounded-full p-2 transition duration-150 ease-in-out"
				onClick={toggleOptions}
			>
				<svg
					className="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
					/>
				</svg>
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
					<Link
						href={`/profile/${screenName}/postedit/${postId}`}
						className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
					>
						投稿を編集
					</Link>
				</div>
			)}
		</div>
	)
}
