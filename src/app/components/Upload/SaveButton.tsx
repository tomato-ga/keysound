import React from 'react'

interface SaveButtonProps {
	type?: 'button' | 'submit' | 'reset'
}

const SaveButton: React.FC<SaveButtonProps> = ({ type = 'button' }) => {
	return (
		<div className="text-center">
			<button type={type} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">
				投稿する
			</button>
		</div>
	)
}

export default SaveButton
