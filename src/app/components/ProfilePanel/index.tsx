// src/app/components/ProfilePanel.tsx

import React from 'react'
import Image from 'next/image'

interface ProfilePanelProps {
	profile: {
		id: string
		screenName: string
		bio: string | null
		user: {
			name: string
			image: string | null
		}
	}
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile }) => {
	return (
		<div className="profile-panel">
			<div className="profile-header">
				{profile.user.image && (
					<Image
						src={profile.user.image}
						alt={`${profile.user.name}'s profile picture`}
						width={100}
						height={100}
						className="profile-image"
					/>
				)}
				<h1 className="profile-name">{profile.user.name}</h1>
				<p className="profile-screen-name">@{profile.screenName}</p>
			</div>
			{profile.bio && <p className="profile-bio">{profile.bio}</p>}
		</div>
	)
}

export default ProfilePanel
