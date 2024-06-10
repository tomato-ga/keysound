'use server'

import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'

const getSession = async () => {
	return await getServerSession(authOptions)
}

/**
 * 現在のセッションに関連付けられたユーザーのscreenNameを取得する
 *
 * @returns {Promise<string | null>} ユーザーのscreenName（存在しない場合はnull）
 */

export const getScreenName = async () => {
	const session = await getSession()
	if (session && session.user && session.user.email) {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { profile: { select: { screenName: true } } }
		})
		return user?.profile?.screenName || null
	}
	return null
}
