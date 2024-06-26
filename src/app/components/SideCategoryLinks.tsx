// src/components/SideCategoryLinks.tsx
import React from "react";
import Link from "next/link";

// カテゴリの型定義
interface Category {
	id: number;
	name: string;
	url: string;
}

// サンプルカテゴリデータ
const categories: Category[] = [
	{ id: 1, name: "サイドバー", url: "/category1" },
	{ id: 2, name: "サイドバー2", url: "/category2" },
	{ id: 3, name: "サイドバー3", url: "/category3" },
];

const SideCategoryLinks: React.FC = () => {
	return (
		<nav className="w-[200px]">
			<ul className="space-y-0">
				{categories.map((category) => (
					<li key={category.id}>
						<Link
							href={category.url}
							className="text-gray-700 hover:text-gray-900 block p-2 rounded-lg transition-colors duration-200"
						>
							{category.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default SideCategoryLinks;
