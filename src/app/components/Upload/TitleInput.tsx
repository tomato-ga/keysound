import React from "react";

interface TitleInputProps {
	title: string;
	onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange }) => {
	return (
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-2">タイトル</h2>
			<input
				type="text"
				placeholder="タイトル入力"
				className="w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
				value={title}
				onChange={onTitleChange}
			/>
		</div>
	);
};

export default TitleInput;
