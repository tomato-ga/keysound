// Footer.tsx
import React from 'react'
import Link from 'next/link'

const Footer = () => {
	return (
		<footer className="bg-[#141921] py-8 mt-4">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div>
						<h3 className="text-cyan-400 text-xl font-semibold mb-4">キーボードサウンド</h3>
						<p className="text-gray-400 mb-4">
							キーボードサウンドは、キーボードの「打鍵音」に特化した、ニッチな場所を目指しています。
							自分のお気に入りキーボードの打鍵音を投稿したり、他の人の投稿を探索したりできるようになる予定です。
							ぜひみなさんのキーボードの音を聞かせてください。
						</p>
					</div>
					<div>
						<h3 className="text-cyan-400 text-xl font-semibold mb-4">リンク</h3>
						<ul className="text-gray-400 space-y-2">
							<li>
								<Link href="/" className="hover:text-cyan-400">
									ホーム
								</Link>
							</li>
							<li>
								<Link href="/about" className="hover:text-cyan-400">
									About
								</Link>
							</li>
							{/* <li>
								<Link href="/blog" className="hover:text-cyan-400">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-cyan-400">
									お問い合わせ
								</Link>
							</li> */}
						</ul>
					</div>
					<div>
						{/* <h3 className="text-cyan-400 text-xl font-semibold mb-4">フォローする</h3>
						<ul className="text-gray-400 space-y-2">
							<li>
								<Link href="https://twitter.com/yourusername" className="hover:text-cyan-400">
									Twitter
								</Link>
							</li>
							
						</ul> */}
					</div>
				</div>
				<hr className="border-gray-700" />
				<p className="text-center text-gray-500 mt-8">
					© {new Date().getFullYear()} キーボードサウンド. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
