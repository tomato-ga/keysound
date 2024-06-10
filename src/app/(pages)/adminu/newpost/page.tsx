// page.tsx
'use client'

import React from 'react'
import Editor from '@/app/components/Editor'

const NewPostPage: React.FC = () => {
	const handleSave = (data: {
		title: string
		content: string
		tags: string[]
		postId?: number | null
		thumb_url: string
	}) => {
		console.log('Saved data:', data)
	}

	return <Editor initialTitle="" initialContent="" initialTags="" postId={null} onSave={handleSave} />
}

export default NewPostPage
