import React from 'react'
import { PostPart } from '../../../../types'

interface PartsInputProps {
	parts: PostPart[]
	onPartsChange: (parts: PostPart[]) => void
}

const PartsInput: React.FC<PartsInputProps> = ({ parts, onPartsChange }) => {
	const handleChange = (index: number, field: keyof PostPart, value: string) => {
		const newParts = [...parts]
		newParts[index] = { ...newParts[index], [field]: value }
		onPartsChange(newParts)
	}

	const handleAddPart = () => {
		onPartsChange([...parts, {}])
	}

	const handleRemovePart = (index: number) => {
		const newParts = parts.filter((_, i) => i !== index)
		onPartsChange(newParts)
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">パーツ</h2>
			{parts.map((part, index) => (
				<div key={index} className="mb-4 p-4 border border-gray-400 rounded-md">
					<div className="mb-4">
						<input
							type="text"
							placeholder="ケース"
							className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
							value={part.case || ''}
							onChange={(e) => handleChange(index, 'case', e.target.value)}
						/>

						<input
							type="text"
							placeholder="プレート"
							className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
							value={part.plate || ''}
							onChange={(e) => handleChange(index, 'plate', e.target.value)}
						/>
						<input
							type="text"
							placeholder="スイッチ"
							className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
							value={part.switches || ''}
							onChange={(e) => handleChange(index, 'switches', e.target.value)}
						/>
						<input
							type="text"
							placeholder="キーキャップ"
							className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
							value={part.keyCaps || ''}
							onChange={(e) => handleChange(index, 'keyCaps', e.target.value)}
						/>
					</div>
					<button
						className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
						onClick={() => handleRemovePart(index)}
						type="button"
					>
						削除
					</button>
				</div>
			))}
			<button
				className="mt-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
				onClick={handleAddPart}
			>
				パーツを追加
			</button>
		</div>
	)
}

export default PartsInput
