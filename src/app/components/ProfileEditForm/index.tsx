// src/app/components/ProfileEditForm.tsx
"use client";

import React from "react";
import { prisma } from "@/app/lib/prisma";

interface ProfileEditFormProps {
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

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
	const [screenName, setScreenName] = React.useState(profile.screenName ?? "");
	const [bio, setBio] = React.useState(profile.bio ?? "");

	console.log("profile", profile);

	const updateProfile = async () => {
		const res = await fetch(`/api/db/userUpdate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId: profile.id, screenName, bio }),
		});
		// プロフィール更新後の処理（例: プロフィール表示画面へのリダイレクト）

		if (res.ok) {
			window.location.href = `/profile/${profile.user.id}`;
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile();
	};

	return (
		<form className="profile-edit-form" onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="screenName">スクリーンネーム</label>
				<input
					type="text"
					id="screenName"
					value={screenName!}
					onChange={(e) => setScreenName(e.target.value)}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="bio">自己紹介</label>
				<textarea
					id="bio"
					value={bio}
					onChange={(e) => setBio(e.target.value)}
				/>
			</div>
			<button type="submit">保存</button>
		</form>
	);
};

export default ProfileEditForm;
