// page.tsx
import React from 'react'
import Editor from '@/app/components/Editor'
import { EditorProps } from '../../../../../types'

const NewPostPage: React.FC = () => {
	const handleSave: EditorProps['onSave'] = (data) => {
		console.log('Saved data:', data)
	}

	const editorProps: EditorProps = {
		initialTitle: '',
		initialContent: '',
		initialTags: '',
		postId: null,
		onSave: handleSave
	}

	return <Editor {...editorProps} />
}

export default NewPostPage
