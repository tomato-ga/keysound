import React, { useState } from 'react'

interface TitleInputProps {
	title: string
	onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange }) => {
	const [titleError, setTitleError] = useState('')

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onTitleChange(e)
		setTitleError('')
	}

	const validateTitle = () => {
		if (!title) {
			setTitleError('タイトルは必須です')
		}
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">タイトル</h2>
			<input
				type="text"
				name="title"
				placeholder="タイトル入力"
				className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
				value={title}
				onChange={handleTitleChange}
				onBlur={validateTitle}
				required
			/>
			{titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
		</div>
	)
}

export default TitleInput
