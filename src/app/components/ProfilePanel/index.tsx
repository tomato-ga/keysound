import React from 'react'
import Image from 'next/image'

interface ProfilePanelProps {
	imageUrl: string
	name: string
	screenName: string
	bio: string
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ imageUrl, name, screenName, bio }) => {
	return (
		<div className="flex items-center space-x-4">
			<div className="w-20 h-20 rounded-full overflow-hidden">
				<Image src={imageUrl} alt={name} width={80} height={80} />
			</div>

			<div>
				<h2 className="text-xl font-bold">{name}</h2>
				<p className="text-gray-500">@{screenName}</p>
			</div>
		</div>
	)
}

export default ProfilePanel
