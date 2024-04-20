// src/app/components/ProfilePanel.tsx
import React from "react";
import Image from "next/image";

interface ProfilePanelProps {
	profile: {
		id: string;
		screenName: string | null;
		bio: string | null;
		user: {
			id: string;
			name: string;
			email: string;
			image: string | null;
			createdat: Date;
			updatedat: Date;
		};
	};
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile }) => {
	return (
		<div className="profile-panel bg-white p-6 rounded-lg shadow-lg mb-8">
			<div className="profile-header flex items-center mb-4">
				{profile.user.image && (
					<Image
						src={profile.user.image}
						alt={`${profile.user.name}'s profile picture`}
						width={100}
						height={100}
						className="profile-image rounded-full mr-4"
					/>
				)}
				<div>
					<h1 className="profile-name text-2xl font-bold text-gray-600">
						{profile.user.name}
					</h1>
					<p className="profile-screen-name text-gray-600">
						@{profile.screenName}
					</p>
				</div>
			</div>
			{profile.bio && (
				<p className="profile-bio text-gray-600">{profile.bio}</p>
			)}
		</div>
	);
};

export default ProfilePanel;
