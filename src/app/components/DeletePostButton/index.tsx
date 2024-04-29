import { useState } from 'react'

interface DeletePostButtonProps {
	onDeleteConfirmed: () => void
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ onDeleteConfirmed }) => {
	const [showConfirmation, setShowConfirmation] = useState(false)

	const handleDeleteClick = () => {
		setShowConfirmation(true)
	}
	const handleConfirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		onDeleteConfirmed()
		setShowConfirmation(false)
	}

	const handleCancelDelete = () => {
		setShowConfirmation(false)
	}

	return (
		<div>
			<button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteClick}>
				投稿を削除する
			</button>
			{showConfirmation && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white p-8 rounded shadow-lg">
						<p className="mb-4">本当に削除しますか？</p>
						<div className="flex justify-end">
							<button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" onClick={handleCancelDelete}>
								キャンセル
							</button>
							<button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleConfirmDelete}>
								削除
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default DeletePostButton
