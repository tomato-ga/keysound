import React from 'react'

interface DescriptionInputProps {
	description: string
	onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ description, onDescriptionChange }) => {
	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">説明文</h2>
			<textarea
				placeholder="説明文を入力"
				name="description"
				className="w-full h-60 bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
				value={description}
				onChange={onDescriptionChange}
			/>
		</div>
	)
}

export default DescriptionInput
