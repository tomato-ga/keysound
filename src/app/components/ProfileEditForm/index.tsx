// src/app/components/ProfileEditForm.tsx

import React from 'react'

interface ProfileEditFormProps {
	profile: {
		screenName: string
		bio: string | null
	}
	onSubmit: (updatedProfile: { screenName: string; bio: string }) => void
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onSubmit }) => {
	const [screenName, setScreenName] = React.useState(profile.screenName)
	const [bio, setBio] = React.useState(profile.bio || '')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({ screenName, bio })
	}

	return (
		<form className="profile-edit-form" onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="screenName">スクリーンネーム</label>
				<input
					type="text"
					id="screenName"
					value={screenName}
					onChange={(e) => setScreenName(e.target.value)}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="bio">自己紹介</label>
				<textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
			</div>
			<button type="submit">保存</button>
		</form>
	)
}

export default ProfileEditForm
