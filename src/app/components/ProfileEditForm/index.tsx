// src/app/components/ProfileEditForm.tsx
'use client'
import React from 'react'
import { prisma } from '@/app/lib/prisma'
import { redirect } from 'next/navigation'

interface ProfileEditFormProps {
	profile: {
		id: string
		screenName: string | null
		bio: string | null
		user: {
			id: string
			name: string
			email: string
			image: string | null
			createdat: Date
			updatedat: Date
		}
	}
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
	const [screenName, setScreenName] = React.useState(profile.screenName ?? '')
	const [bio, setBio] = React.useState(profile.bio ?? '')

	// TODO プロフィールアップデートをserver actionsに変更する
	// TODO スクリーンネームを表示する　Googleアカウントの名前を表に出さない -> DBの設計と、dynamic routeを修正する

	const updateProfile = async () => {
		const res = await fetch(`/api/db/userUpdate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId: profile.id, screenName, bio })
		})

		// プロフィール更新後の処理（例: プロフィール表示画面へのリダイレクト）
		if (res.ok) {
			redirect(`/profile/${profile.screenName}`)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		updateProfile()
	}

	return (
		<form className="profile-edit-form text-gray-600" onSubmit={handleSubmit}>
			<div className="mb-8">
				<label htmlFor="screenName" className="block mb-2">
					スクリーンネーム
				</label>
				<input
					type="text"
					id="screenName"
					value={screenName!}
					className="w-full md:w-1/2 bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onChange={(e) => setScreenName(e.target.value)}
					required
				/>
			</div>
			<div className="mb-8">
				<label htmlFor="bio" className="block mb-2">
					自己紹介
				</label>
				<textarea
					id="bio"
					value={bio}
					className="w-full md:w-1/2 bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onChange={(e) => setBio(e.target.value)}
				/>
			</div>
			<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
				保存
			</button>
		</form>
	)
}

export default ProfileEditForm
