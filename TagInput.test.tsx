import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render, screen } from '@testing-library/react'
import TagInput from '@/app/components/Upload/Taginput'
import { PostFormData } from './types'

describe('TagInput', () => {
	test('renders tag input correctly', () => {
		const postData: PostFormData = {
			title: 'Test Title',
			description: 'Test Description',
			parts: [],
			tags: ['tag1', 'tag2']
		}
		const setPostData = jest.fn()

		render(<TagInput postData={postData} setPostData={setPostData} />)

		expect(
			screen.getByPlaceholderText('複数のタグを入力する場合は[タグを追加]ボタンを押すか、Enterキーを押してください')
		).toBeInTheDocument()
		expect(screen.getByText('タグ')).toBeInTheDocument()
		expect(screen.getByText('タグを追加')).toBeInTheDocument()
		postData.tags?.forEach((tag) => {
			expect(screen.getByText(tag)).toBeInTheDocument()
		})
	})

	// 他のテストケースを追加できます
})
