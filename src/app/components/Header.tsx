import Link from 'next/link'

const Header = () => {
	return (
		<header className="bg-black py-5">
			<div className="container mx-auto flex justify-between">
				<h1 className="text-white">
					<Link href="/">キーボードサウンド</Link>
				</h1>

				<ul className="flex gap-3">
					<li>
						<Link href="/about" className="text-white">
							検索ボタン
						</Link>
					</li>
					<li>
						<Link href="/about" className="text-white">
							プロフィール
						</Link>
					</li>
					<li>
						<Link href="/about" className="text-white">
							作品を投稿する
						</Link>
					</li>

					<li>
						<Link href="/about" className="text-white">
							About
						</Link>
					</li>
					<li>
						<Link href="/blog" className="text-white">
							Blog
						</Link>
					</li>

					<li>
						<Link href="/login" className="text-white">
							ログイン
						</Link>
					</li>
				</ul>
			</div>
		</header>
	)
}

export default Header
