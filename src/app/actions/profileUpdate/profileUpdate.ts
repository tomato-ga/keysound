'use server'
import { prisma } from '@/app/lib/prisma'
import { PostFormData } from '../../../../types'
import { profile } from 'console'
import { revalidatePath } from 'next/cache'

interface profileUpdateActionProps {
	profileId: string
	screenName: string
	bio: string
}

export const profileUpdateAction = async ({ profileId, screenName, bio }: profileUpdateActionProps) => {
	try {
		const userProfile = await prisma.profile.update({
			where: { id: profileId },
			data: {
				screenName: screenName,
				bio: bio
			}
		})

		if (!userProfile) {
			throw new Error('User not found')
		}

		revalidatePath(`/profile${userProfile.screenName}`)
		return userProfile.screenName
	} catch (error) {
		console.error('Error creating post:', error)
		throw error
	}
}
