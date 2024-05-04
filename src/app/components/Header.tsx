'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useMenubarStore from '../stores/useMenubar'
import { Session } from 'next-auth'
import { getScreenName } from '../actions/getScreenName/getScreenName'

interface HeaderProps {
	session: Session | null
}

const Header: React.FC<HeaderProps> = ({ session }) => {
	const { toggleMenubar, menubarOpen, closeMenubar } = useMenubarStore()
	const menubarRef = useRef<HTMLDivElement>(null)
	const [screenName, setScreenName] = useState<string | null>(null)

	useEffect(() => {
		const fetchScreenName = async () => {
			if (session) {
				const name = await getScreenName()
				setScreenName(name)
			}
		}
		fetchScreenName()
	}, [session])

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
			if (!menubarRef.current?.contains(event.target as Node) && menubarOpen) {
				closeMenubar()
			}
		}
		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('touchstart', handleOutsideClick)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
			document.removeEventListener('touchstart', handleOutsideClick)
		}
	}, [menubarOpen, closeMenubar])

	const handleLinkClick = () => {
		if (menubarOpen) {
			closeMenubar()
		}
	}

	return (
		<header className="relative bg-white text-black w-full border-b border-gray-300">
			<div className="flex items-center justify-between w-full h-12 px-3">
				<div className="ml-4">
					<Link href="/">
						<img src="/siteicon.png" className="h-12 w-auto" alt="みんなのキーボードサウンド" />
					</Link>
				</div>
				<div className="flex items-center justify-end flex-grow">
					<button onClick={toggleMenubar} className="text-black lg:hidden ml-auto">
						🍔
					</button>
				</div>
				<div
					ref={menubarRef}
					className={`${
						menubarOpen
							? 'fixed inset-0 bg-white p-4 flex flex-col space-y-4 z-50 transition-transform duration-300 ease-in-out'
							: 'hidden'
					} lg:flex lg:flex-grow lg:items-center lg:justify-end lg:space-x-4 lg:flex-row`}
				>
					<button onClick={closeMenubar} className="self-end text-xl font-bold lg:hidden">
						×
					</button>
					<Link href="/search" onClick={handleLinkClick}>
						<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">検索</span>
					</Link>

					<Link href="/about" onClick={handleLinkClick}>
						<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">About</span>
					</Link>
					<Link href="/blog" onClick={handleLinkClick}>
						<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">Blog</span>
					</Link>

					{session ? (
						<>
							<Link href="/post/upload" onClick={handleLinkClick}>
								<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">
									音を投稿する
								</span>
							</Link>
							<Link href={`/profile/${screenName}`} onClick={handleLinkClick}>
								<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">
									プロフィール
								</span>
							</Link>
							<Link href="/login" onClick={handleLinkClick}>
								<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">ログアウト</span>
							</Link>
						</>
					) : (
						<Link href="/login" onClick={handleLinkClick}>
							<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">
								投稿するにはログインが必要です
							</span>
						</Link>
					)}
				</div>
			</div>
		</header>
	)
}

export default Header
