import React from 'react'

interface SaveButtonProps {
	onSave: () => void
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
	return (
		<div className="text-center">
			<button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded" onClick={onSave}>
				投稿する
			</button>
		</div>
	)
}

export default SaveButton
