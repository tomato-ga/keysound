import Link from 'next/link'
import { useAuthSession } from '../func/useAuthSession'
import Session from './Session'

// TODO スマホ表示の場合の調整してない
const Header = () => {
	const { session, status } = useAuthSession()

	return (
		<header className="bg-black py-5">
			<div className="container mx-auto flex justify-between">
				<h1 className="text-white">
					<Link href="/">キーボードサウンド</Link>
				</h1>

				<ul className="flex gap-3">
					<li>
						<Link href="/about" className="text-white">
							検索
						</Link>
					</li>
					<li>
						<Link href="/profile" className="text-white">
							プロフィール
						</Link>
					</li>

					{status === 'authenticated' && session ? (
						<li>
							<Link href="/post/upload" className="text-white">
								音を投稿する
							</Link>
						</li>
					) : null}

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
