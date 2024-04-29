"use client";

import React from "react";
import { ChangeEvent } from "react";

interface FileUploadButtonProps {
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	hasUploadedVideo: boolean;
	videoUrl: string | undefined
}

// TODO ファイルアップロードできてるのにURLが取得できていないのは、formのnameに指定していないからだ。
const FileUploadButton: React.FC<FileUploadButtonProps> = ({
	onFileChange,
	hasUploadedVideo,
	videoUrl
}) => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleClickUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault(); // デフォルト動作を防止
		fileInputRef.current?.click(); // 関連付けられたinput要素をプログラム的にクリック
	};

	return (
		<div className="mb-8 text-center">
			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				onChange={onFileChange}
				accept="video/*"
				disabled={hasUploadedVideo}
			/>
			<input type="hidden" name="videourl" value={videoUrl}/>
			<button
				className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
				title="動画をアップロードする"
				onClick={handleClickUpload}
				disabled={hasUploadedVideo}
			>
				動画を選択 <br />
				<small>※アップロードできるファイルは100MBまでとなっています</small>
			</button>
		</div>
	);
};

export default FileUploadButton;
