// src/app/(pages)/profile/[profileId]/edit/page.tsx

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth/[...nextauth]'
import { prisma } from '@/app/lib/prisma'
import ProfileEditForm from '@/app/components/ProfileEditForm'
import { notFound } from 'next/navigation'

interface EditProfilePageProps {
	params: {
		profileId: string
	}
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
	const session = await getServerSession(authOptions)

	if (!session || !session.user || !session.user.name) {
		return <div>ユーザーセッションが見つかりません</div>
	}

	const profile = await prisma.profile.findUnique({
		where: { id: params.profileId },
		include: { user: true }
	})

	if (!profile || profile.user.name !== session.user.name) {
		notFound()
	}

	const updateProfile = async (updatedProfile: { screenName: string; bio: string }) => {
		await prisma.profile.update({
			where: { id: profile.id },
			data: updatedProfile
		})
		// プロフィール更新後の処理（例: プロフィール表示画面へのリダイレクト）
		window.location.href = `/profile`
	}

	return (
		<div>
			<h1>プロフィール編集</h1>
			<ProfileEditForm profile={profile} onSubmit={updateProfile} />
		</div>
	)
}
