import React from 'react'

interface SaveButtonProps {
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void // 型を修正
}

const SaveButton: React.FC<SaveButtonProps> = ({ type = 'button', disabled = false, onClick }) => {
	return (
		<div className="mb-8 text-center">
			<button
				type={type}
				className="bg-red-300 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
				disabled={disabled}
				onClick={onClick}
			>
				投稿する
			</button>
		</div>
	)
}

export default SaveButton
