// src/components/Header.tsx

'use client'

import React from 'react'
import Link from 'next/link'
import useSidebarStore from '../(pages)/stores/useSiderbar'
import { Session } from 'next-auth'

interface HeaderProps {
	session: Session | null
}

const Header: React.FC<HeaderProps> = ({ session }) => {
	const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)

	return (
		<header className="bg-gray-800 py-5 border-b border-gray-700">
			<div className="container mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
				<h1 className="text-cyan-400 text-2xl font-bold mb-4 sm:mb-0">
					<Link href="/">キーボードサウンド</Link>
				</h1>
				<ul className="flex flex-wrap justify-center gap-3">
					<li>
						<Link href="/about" className="text-gray-300 hover:text-cyan-400">
							検索
						</Link>
					</li>
					<li>
						<Link href="/profile" className="text-gray-300 hover:text-cyan-400">
							プロフィール
						</Link>
					</li>
					{session ? (
						<li>
							<Link href="/post/upload" className="text-gray-300 hover:text-cyan-400">
								音を投稿する
							</Link>
						</li>
					) : (
						<div className="text-gray-300">音を投稿するにはログイン</div>
					)}
					<li>
						<Link href="/about" className="text-gray-300 hover:text-cyan-400">
							About
						</Link>
					</li>
					<li>
						<Link href="/blog" className="text-gray-300 hover:text-cyan-400">
							Blog
						</Link>
					</li>
					<li>
						<Link href="/login" className="text-gray-300 hover:text-cyan-400">
							ログイン
						</Link>
					</li>
				</ul>
			</div>
		</header>
	)
}

export default Header
