'use client'

import { useState } from 'react'

const UploadPage = () => {
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [file, setFile] = useState<string>('')
	// TODO SQL用に追加createdAt , updatedAt

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// TODO S3 アップロード処理 -> S3 URLをSQLに保存する
	}

	return (
		<>
			<div className="container mx-auto p-2">
				<h1>アップロードする</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="title">タイトル</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="border border-red-100"
						/>
					</div>
					<div>
						<label htmlFor="description">説明</label>
						<textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
					</div>
					<div>
						<label htmlFor="file">ファイル</label>
						<input type="file" id="file" onChange={(e) => setFile(e.target.files)} />
					</div>
					<button type="submit">アップロード</button>
				</form>
			</div>
		</>
	)
}

export default UploadPage
