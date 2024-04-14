// Header.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import useSidebarStore from '../stores/useSiderbar' // ストアのインポート
import { Session } from 'next-auth'

interface HeaderProps {
	session: Session | null // セッション情報
}

const Header: React.FC<HeaderProps> = ({ session }) => {
	const { toggleSidebar } = useSidebarStore()

	return (
		<header className="relative">
			<div className="flex items-center h-12 pl-3 justify-between bg-[#141921] border-t-2 border-orange-300">
				<div className="flex items-center">
					{/* <img src="/logo.png" alt="キーボードサウンド" className="h-8" /> */}
					<Link href="/">
						<span className="text-white px-3 rounded-sm cursor-pointer font-bold">キーボードサウンド</span>
					</Link>
				</div>
				<div className="flex space-x-2 lg:space-x-4">
					<Link href="/about">
						<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
							検索
						</span>
					</Link>
					<Link href="/profile">
						<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
							プロフィール
						</span>
					</Link>
					{session ? (
						<Link href="/post/upload">
							<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
								音を投稿する
							</span>
						</Link>
					) : (
						<div className="text-white">音を投稿するにはログイン</div>
					)}
					<Link href="/about">
						<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
							About
						</span>
					</Link>
					<Link href="/blog">
						<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
							Blog
						</span>
					</Link>
					<Link href="/login">
						<span className="text-white hover:text-yellow-400 px-2 py-1 rounded-md cursor-pointer font-semibold">
							ログイン
						</span>
					</Link>
				</div>
				<button onClick={toggleSidebar} className="lg:hidden text-white">
					🍔
				</button>
			</div>
		</header>
	)
}

export default Header
