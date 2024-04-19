import React, { useState } from 'react'
import { PostPart } from '../../../../types'

interface PartsInputProps {
	parts: PostPart[]
	onPartsChange: (parts: PostPart[]) => void
}

const PartsInput: React.FC<PartsInputProps> = ({ parts, onPartsChange }) => {
	const [partInput, setPartInput] = useState<PostPart>({
		case: '',
		plate: '',
		switches: '',
		keyCaps: ''
	})

	const handleChange = (field: keyof PostPart, value: string) => {
		setPartInput((prevPartInput) => ({
			...prevPartInput,
			[field]: value
		}))
	}

	const handleAddPart = () => {
		if (Object.values(partInput).some((value) => value.trim() !== '')) {
			onPartsChange([...parts, partInput])
			setPartInput({
				case: '',
				plate: '',
				switches: '',
				keyCaps: ''
			})
		}
	}

	const handleRemovePart = (index: number) => {
		const newParts = parts.filter((_, i) => i !== index)
		onPartsChange(newParts)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddPart()
		}
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">パーツ</h2>
			<div>
				<input
					type="text"
					placeholder="ケース"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.case}
					onChange={(e) => handleChange('case', e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<input
					type="text"
					placeholder="プレート"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.plate}
					onChange={(e) => handleChange('plate', e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<input
					type="text"
					placeholder="スイッチ"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.switches}
					onChange={(e) => handleChange('switches', e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<input
					type="text"
					placeholder="キーキャップ"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.keyCaps}
					onChange={(e) => handleChange('keyCaps', e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="button"
					className="mt-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
					onClick={handleAddPart}
				>
					パーツを追加
				</button>
			</div>
			<div className="flex flex-wrap mt-4">
				{parts
					.filter((part) => part.case || part.plate || part.switches || part.keyCaps)
					.map((part, index) => (
						<div key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
							<span>
								{part.case && `ケース: ${part.case}`}
								{part.plate && `プレート: ${part.plate}`}
								{part.switches && `スイッチ: ${part.switches}`}
								{part.keyCaps && `キーキャップ: ${part.keyCaps}`}
							</span>
							<button
								type="button"
								className="ml-2 text-gray-600 hover:text-gray-800"
								onClick={() => handleRemovePart(index)}
							>
								×
							</button>
						</div>
					))}
			</div>
		</div>
	)
}

export default PartsInput
