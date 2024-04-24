import React, { useEffect, useState, useTransition } from 'react'
import { useDebounce } from './useDebounce'
import { getSuggestedTags } from '@/app/actions/getSuggestedTags/getSuggestedTags'
import { PostFormData, UpdateTags } from '../../../../types'

interface TagInputProps<T> {
	postData: T
	setPostData: React.Dispatch<React.SetStateAction<T>>
	onTagsChange: (tags: (string | UpdateTags)[]) => void
}

const TagInput = <T extends { tags?: string[] | UpdateTags[] }>({
	postData,
	setPostData,
	onTagsChange
}: TagInputProps<T>) => {
	const [tagInput, setTagInput] = useState<string>('')
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
		console.log(`Key pressed: ${e.key}, Selected index: ${selectedSuggestionIndex}`)
		if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedSuggestionIndex >= 0) {
				console.log('suggestedTags', suggestedTags)
				const selectedTag = suggestedTags[selectedSuggestionIndex]
				handleAddTags(selectedTag)
			} else {
				handleAddTags(tagInput.trim())
			}
		} else if (e.key === 'ArrowDown') {
			console.log(`Key pressed: ${e.key}, Selected index: ${selectedSuggestionIndex}`)
			e.preventDefault()
			setSelectedSuggestionIndex((prevIndex) => Math.min(prevIndex + 1, suggestedTags.length - 1))
		} else if (e.key === 'ArrowUp') {
			console.log(`Key pressed: ${e.key}, Selected index: ${selectedSuggestionIndex}`)
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

	const handleAddTags = (tag?: string) => {
		if ((tag && tag.trim()) || tagInput.trim()) {
			const newTags = tag
				? [tag]
				: tagInput
						.split(',')
						.map((t) => t.trim())
						.filter((t) => t !== '')
			setPostData((prevState) => ({
				...prevState,
				tags: [...(prevState.tags || []), ...newTags]
			}))
			onTagsChange([...(postData.tags || []), ...newTags])
			setTagInput('')
			setSelectedSuggestionIndex(-1)
			setSuggestedTags([])
		}
	}

	const handleRemoveTag = (index: number) => {
		const newTags = (postData.tags || []).filter((_, i) => i !== index)
		setPostData((prevState) => ({
			...prevState,
			tags: newTags
		}))
		onTagsChange(newTags)
	}

	const handleSuggestedTagClick = (tag: string, index: number) => {
		handleAddTags(tag)
		setSelectedSuggestionIndex(index)
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
								onClick={() => handleSuggestedTagClick(tag, index)}
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
					onChange={(e) => setTagInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="button"
					className="mt-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
					onClick={(e) => {
						e.preventDefault()
						handleAddTags()
					}}
				>
					タグを追加
				</button>
				<div className="flex flex-wrap mt-4">
					{postData.tags?.map((tag, index) => (
						<div key={index} className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 flex items-center">
							<span>{typeof tag === 'string' ? tag : tag.tag.name}</span>
							<button className="ml-2 text-gray-600 hover:text-gray-800" onClick={() => handleRemoveTag(index)}>
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
