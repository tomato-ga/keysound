import React from 'react'
import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { Button } from './ui/button'

interface GroupedParts {
	[key: string]: Set<string>
}

interface PartsData {
	groupedByCase: GroupedParts
	groupedBySwitches: GroupedParts
	groupedByPlate: GroupedParts
	groupedByKeyCaps: GroupedParts
}

const fetchParts = async (): Promise<PartsData> => {
	const getParts = await prisma.part.findMany({
		take: 10
	})

	const groupedByCase: GroupedParts = {}
	const groupedBySwitches: GroupedParts = {}
	const groupedByPlate: GroupedParts = {}
	const groupedByKeyCaps: GroupedParts = {}

	getParts.forEach((part) => {
		if (part.case && !groupedByCase[part.case]) {
			groupedByCase[part.case] = new Set()
		}
		if (part.case) {
			groupedByCase[part.case].add(part.postId)
		}

		if (part.switches && !groupedBySwitches[part.switches]) {
			groupedBySwitches[part.switches] = new Set()
		}
		if (part.switches) {
			groupedBySwitches[part.switches].add(part.postId)
		}

		if (part.plate && !groupedByPlate[part.plate]) {
			groupedByPlate[part.plate] = new Set()
		}
		if (part.plate) {
			groupedByPlate[part.plate].add(part.postId)
		}

		if (part.keyCaps && !groupedByKeyCaps[part.keyCaps]) {
			groupedByKeyCaps[part.keyCaps] = new Set()
		}
		if (part.keyCaps) {
			groupedByKeyCaps[part.keyCaps].add(part.postId)
		}
	})

	return {
		groupedByCase,
		groupedBySwitches,
		groupedByPlate,
		groupedByKeyCaps
	}
}

const Sidebar = async () => {
	const { groupedByCase, groupedBySwitches, groupedByPlate, groupedByKeyCaps } = await fetchParts()

	return (
		<div className="bg-white p-6 order-2 md:order-1 transform w-full md:w-80 border-r mt-2">
			<div className="text-black space-y-6">
				<div>
					<h4 className="text-xl font-bold mb-3">ケース</h4>
					{Object.keys(groupedByCase).length > 0 ? (
						<div className="flex flex-wrap">
							{Object.keys(groupedByCase).map(
								(caseName) =>
									caseName &&
									Array.from(groupedByCase[caseName]).map((postId) => (
										<Link key={postId} href={`/post/${postId}`}>
											<Button
												className="m-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-1.2rem)]"
												title={caseName}
											>
												{caseName}
											</Button>
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
							{Object.keys(groupedBySwitches).map(
								(switchName) =>
									switchName &&
									Array.from(groupedBySwitches[switchName]).map((postId) => (
										<Link key={postId} href={`/post/${postId}`}>
											<Button
												className="m-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-1.2rem)]"
												title={switchName}
											>
												{switchName}
											</Button>
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
							{Object.keys(groupedByPlate).map(
								(plateName) =>
									plateName &&
									Array.from(groupedByPlate[plateName]).map((postId) => (
										<Link key={postId} href={`/post/${postId}`}>
											<Button
												className="m-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-1.2rem)]"
												title={plateName}
											>
												{plateName}
											</Button>
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
							{Object.keys(groupedByKeyCaps).map(
								(keyCapsName) =>
									keyCapsName &&
									Array.from(groupedByKeyCaps[keyCapsName]).map((postId) => (
										<Link key={postId} href={`/post/${postId}`}>
											<Button
												className="m-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100%-1.2rem)]"
												title={keyCapsName}
											>
												{keyCapsName}
											</Button>
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
