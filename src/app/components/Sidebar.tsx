import React from 'react'
import { prisma } from '../lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Sidebar: React.FC = async () => {
	const getParts = await prisma.part.findMany({
		take: 10
	})

	console.log('getParts', getParts)

	// グループ化処理
	const groupedByCase: { [key: string]: Set<string> } = {}
	const groupedBySwitches: { [key: string]: Set<string> } = {}
	const groupedByPlate: { [key: string]: Set<string> } = {}
	const groupedByKeyCaps: { [key: string]: Set<string> } = {}

	getParts.forEach((part) => {
		// ケースのグループ化
		if (part.case && part.case.trim() !== '') {
			if (!groupedByCase[part.case]) {
				groupedByCase[part.case] = new Set()
			}
			groupedByCase[part.case].add(part.postId)
		}

		// スイッチのグループ化
		if (part.switches && part.switches.trim() !== '') {
			if (!groupedBySwitches[part.switches]) {
				groupedBySwitches[part.switches] = new Set()
			}
			groupedBySwitches[part.switches].add(part.postId)
		}

		// プレートのグループ化
		if (part.plate && part.plate.trim() !== '') {
			if (!groupedByPlate[part.plate]) {
				groupedByPlate[part.plate] = new Set()
			}
			groupedByPlate[part.plate].add(part.postId)
		}

		// キーキャップのグループ化
		if (part.keyCaps && part.keyCaps.trim() !== '') {
			if (!groupedByKeyCaps[part.keyCaps]) {
				groupedByKeyCaps[part.keyCaps] = new Set()
			}
			groupedByKeyCaps[part.keyCaps].add(part.postId)
		}
	})

	return (
		<div className="bg-white p-6 order-2 md:order-1 transform w-full md:w-1/3 lg:w-1/5 border-r mt-2">
			<div className="text-black space-y-6">
				<div>
					<h4 className="text-xl font-bold mb-3">ケース</h4>
					{Object.keys(groupedByCase).length > 0 ? (
						<div className="flex flex-wrap">
							{Object.keys(groupedByCase).map((caseName) =>
								Array.from(groupedByCase[caseName]).map((postId) => (
									<Link key={postId} href={`/post/${postId}`} className="m-2">
										<Button className="break-words">{caseName}</Button>
									</Link>
								))
							)}
						</div>
					) : (
						<p>No parts available.</p>
					)}
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">スイッチ</h4>
					{Object.keys(groupedBySwitches).length > 0 ? (
						<div className="flex flex-wrap">
							{Object.keys(groupedBySwitches).map((switchName) =>
								Array.from(groupedBySwitches[switchName]).map((postId) => (
									<Link key={postId} href={`/post/${postId}`} className="m-2">
										<Button className="break-words">{switchName}</Button>
									</Link>
								))
							)}
						</div>
					) : (
						<p>No parts available.</p>
					)}
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">プレート</h4>
					{Object.keys(groupedByPlate).length > 0 ? (
						<div className="flex flex-wrap">
							{Object.keys(groupedByPlate).map((plateName) =>
								Array.from(groupedByPlate[plateName]).map((postId) => (
									<Link key={postId} href={`/post/${postId}`} className="m-2">
										<Button className="break-words">{plateName}</Button>
									</Link>
								))
							)}
						</div>
					) : (
						<p>No parts available.</p>
					)}
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">キーキャップ</h4>
					{Object.keys(groupedByKeyCaps).length > 0 ? (
						<div className="flex flex-wrap">
							{Object.keys(groupedByKeyCaps).map((keyCapsName) =>
								Array.from(groupedByKeyCaps[keyCapsName]).map((postId) => (
									<Link key={postId} href={`/post/${postId}`} className="m-2">
										<Button className="break-words">{keyCapsName}</Button>
									</Link>
								))
							)}
						</div>
					) : (
						<p>No parts available.</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Sidebar
