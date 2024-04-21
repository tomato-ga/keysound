import React, { useEffect, useState, useTransition } from 'react'
import { useDebounce } from './useDebounce'
import { getSuggestedTags } from '@/app/actions/getSuggestedTags/getSuggestedTags'

interface TagInputProps {
	tags: string[]
	tagInput: string
	onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onAddTags: (tag?: string) => void
	onRemoveTag: (index: number) => void
}

const TagInput: React.FC<TagInputProps> = ({ tags, tagInput, onTagInputChange, onAddTags, onRemoveTag }) => {
	const [suggestedTags, setSuggestedTags] = useState<string[]>([])
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1)
	const [isPending, startTransition] = useTransition()
	const debouncedTagInput = useDebounce(tagInput, 500)

	useEffect(() => {
		if (debouncedTagInput.trim()) {
			startTransition(async () => {
				const suggested = await getSuggestedTags(debouncedTagInput)
				setSuggestedTags(suggested)
			})
		} else {
			setSuggestedTags([])
		}
	}, [debouncedTagInput])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		console.log(`Key Pressed: ${e.key}, Selected Index: ${selectedSuggestionIndex}`) // デバッグ用ログを出力
		if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedSuggestionIndex >= 0) {
				console.log(`Adding suggested tag: ${suggestedTags[selectedSuggestionIndex]}`) // 選択されたサジェストタグをログに出力
				onAddTags(suggestedTags[selectedSuggestionIndex])
				onTagInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
				setSelectedSuggestionIndex(-1)
				setSuggestedTags([]) // サジェストリストをクリア
			} else {
				console.log(`Adding input tag: ${tagInput}`) // 入力されたタグをログに出力
				onAddTags(tagInput)
				onTagInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedSuggestionIndex((prevIndex) => Math.min(prevIndex + 1, suggestedTags.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, -1))
		} else if (e.key === 'Tab') {
			e.preventDefault()
			if (e.shiftKey) {
				setSelectedSuggestionIndex((prevIndex) => (prevIndex <= 0 ? suggestedTags.length - 1 : prevIndex - 1))
			} else {
				setSelectedSuggestionIndex((prevIndex) => (prevIndex === suggestedTags.length - 1 ? 0 : prevIndex + 1))
			}
		}
	}

	const handleSuggestedTagClick = (tag: string) => {
		onAddTags(tag)
		onTagInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
		setSelectedSuggestionIndex(-1)
		setSuggestedTags([]) // サジェストを選択した後、サジェストリストをクリアする
	}

	return (
		<div className="mb-8">
			{isPending ? (
				<div>Loading...</div>
			) : (
				suggestedTags.length > 0 && (
					<ul className="mt-2 bg-white border border-gray-400 rounded-md">
						{suggestedTags.map((tag, index) => (
							<li
								key={tag}
								className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
									index === selectedSuggestionIndex ? 'bg-gray-200' : ''
								}`}
								onClick={() => handleSuggestedTagClick(tag)}
							>
								{tag}
							</li>
						))}
					</ul>
				)
			)}
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
