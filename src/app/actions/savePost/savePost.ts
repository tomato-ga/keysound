'use server'

import { getServerSession } from 'next-auth/next'
import { PostFormData } from '../../../../types'
import { handleSavePost } from '../handleSavePost/handleSavePost'
import { authOptions } from '@/auth/[...nextauth]'
import { redirect } from 'next/navigation'

export const savePostAction = async (formData: FormData) => {
	console.log('savePostAction formdata: ', formData)

	const title = formData.get('title') as string
	const description = formData.get('description') as string
	const videourl = formData.get('videourl') as string
	const youtube = formData.get('youtube') as string
	const thumbnail = formData.get('thumbnail') as string
	const category = formData.get('category') as string
	const partCase = formData.get('partCase') as string
	const partPlate = formData.get('partPlate') as string
	const partSwitches = formData.get('partSwitches') as string
	const partKeyCaps = formData.get('partKeyCaps') as string

	const postData: PostFormData = {
		title,
		description,
		videourl,
		youtube,
		thumbnail,
		category,
		parts: [{ case: partCase, plate: partPlate, switches: partSwitches, keyCaps: partKeyCaps }]
	}

	console.log('savePostAction', postData)

	let postId
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.email) {
			throw Error('User not found')
		}

		postId = await handleSavePost(postData, session?.user.email)
		return postId
	} catch (error) {
		console.error('Error saving post: ', error)
		throw error
	}
}
