import React from 'react'

interface TagInputProps {
	tags: string[]
	tagInput: string
	onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onAddTags: () => void
	onRemoveTag: (index: number) => void
}

// TODO タグ一覧をDBから取得してレコメンド表示したい

const TagInput: React.FC<TagInputProps> = ({ tags, tagInput, onTagInputChange, onAddTags, onRemoveTag }) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			onAddTags()
		}
	}

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">タグ</h2>
			<div>
				<input
					type="text"
					placeholder="複数のタグを入力する場合は[タグを追加]ボタンを押すか、Enterキーを押してください"
					className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
					value={tagInput}
					onChange={onTagInputChange}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="mt-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
					onClick={(e) => {
						e.preventDefault()
						onAddTags()
					}}
				>
					タグを追加
				</button>
				<div className="flex flex-wrap mt-4">
					{tags.map((tag, index) => (
						<div key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
							<span>{tag}</span>
							<button className="ml-2 text-gray-600 hover:text-gray-800" onClick={() => onRemoveTag(index)}>
								×
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default TagInput
