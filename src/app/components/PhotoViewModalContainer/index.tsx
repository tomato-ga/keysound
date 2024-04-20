// components/PhotoViewModalContainer.tsx
import React, { useState } from "react";
import Modal from "../Modal";

interface PhotoViewModalContainerProps {
	photo: {
		id: string;
		title: string;
		description: string;
		imageUrl: string | null;
		videoUrl: string | null;
		createdAt: Date;
		updatedAt: Date;
		tags: { id: string; name: string }[];
	};
	children: React.ReactNode;
}

const PhotoViewModalContainer: React.FC<PhotoViewModalContainerProps> = ({
	photo,
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<div onClick={openModal}>{children}</div>
			{isOpen && (
				<Modal onClose={closeModal}>
					{/* 写真詳細情報をここに表示 */}
					<div>
						<h2 className="text-xl font-bold">{photo.title}</h2>
						<p>{photo.description}</p>
						{photo.imageUrl && (
							<img src={photo.imageUrl} alt={photo.title} className="w-full" />
						)}
						{photo.videoUrl && (
							<video src={photo.videoUrl} controls className="w-full"></video>
						)}
						{/* その他の詳細情報 */}
					</div>
				</Modal>
			)}
		</>
	);
};

export default PhotoViewModalContainer;
