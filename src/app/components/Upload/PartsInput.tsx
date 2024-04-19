import React, { useState } from 'react'
import { PostPart } from '../../../../types'

interface PartsInputProps {
	parts: PostPart[]
	onPartsChange: (parts: PostPart) => void
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
			[field]: value.trim() !== '' ? value : undefined
		}))
		onPartsChange(partInput)
	}

	// 修正箇所: handleRemovePart関数を追加
	const handleRemovePart = (field: keyof PostPart) => {
		setPartInput((prevPartInput) => ({
			...prevPartInput,
			[field]: undefined
		}))
		onPartsChange(partInput)
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">パーツ</h2>
			<div>
				<input
					type="text"
					placeholder="ケース"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.case ?? ''}
					onChange={(e) => handleChange('case', e.target.value)}
				/>
				<input
					type="text"
					placeholder="プレート"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.plate ?? ''}
					onChange={(e) => handleChange('plate', e.target.value)}
				/>
				<input
					type="text"
					placeholder="スイッチ"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.switches ?? ''}
					onChange={(e) => handleChange('switches', e.target.value)}
				/>
				<input
					type="text"
					placeholder="キーキャップ"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-2"
					value={partInput.keyCaps ?? ''}
					onChange={(e) => handleChange('keyCaps', e.target.value)}
				/>
			</div>
			<div className="flex flex-col mt-4">
				{partInput.case && (
					<div className="bg-gray-200 rounded-md px-3 py-1 mr-2 mb-4 flex items-center font-bold text-lg">
						ケース: {partInput.case}
						<button
							type="button"
							className="ml-2 text-gray-600 hover:text-gray-800"
							onClick={() => handleRemovePart('case')}
						>
							×
						</button>
					</div>
				)}
				{partInput.plate && (
					<div className="bg-gray-200 rounded-md px-3 py-1 mr-2 mb-4 flex items-center font-bold text-lg">
						プレート: {partInput.plate}
						<button
							type="button"
							className="ml-2 text-gray-600 hover:text-gray-800"
							onClick={() => handleRemovePart('plate')}
						>
							×
						</button>
					</div>
				)}
				{partInput.switches && (
					<div className="bg-gray-200 rounded-md px-3 py-1 mr-2 mb-4 flex items-center font-bold text-lg">
						スイッチ: {partInput.switches}
						<button
							type="button"
							className="ml-2 text-gray-600 hover:text-gray-800"
							onClick={() => handleRemovePart('switches')}
						>
							×
						</button>
					</div>
				)}
				{partInput.keyCaps && (
					<div className="bg-gray-200 rounded-md px-3 py-1 mr-2 mb-4 flex items-center font-bold text-lg">
						キーキャップ: {partInput.keyCaps}
						<button
							type="button"
							className="ml-2 text-gray-600 hover:text-gray-800"
							onClick={() => handleRemovePart('keyCaps')}
						>
							×
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default PartsInput
