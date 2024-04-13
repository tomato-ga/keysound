// src/app/components/Sidebar.tsx
import Link from 'next/link'

const Sidebar: React.FC = () => {
	return (
		<div className="w-64 bg-gray-800 text-cyan-400 p-4">
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-2">ホーム</h2>
				<ul>
					<li className="mb-1">
						<Link href="/">検索</Link>
					</li>
				</ul>
			</div>
			<div>
				<h2 className="text-xl font-bold mb-2">タグ</h2>
				<ul>
					<li className="mb-1">
						<Link href="/tags/electronic">エレクトロニック</Link>
					</li>
					<li className="mb-1">
						<Link href="/tags/techno">テクノ</Link>
					</li>
					<li className="mb-1">
						<Link href="/tags/hardstyle">ハードスタイル</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
