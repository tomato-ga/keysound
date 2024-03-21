'use client'

import { useState } from 'react'

// TODO アップロードから完成させる
const UploadPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="bg-white rounded-lg  w-full max-w-xl m-2 p-6 lg:w-full lg:m-6 lg:max-w-4xl">
				<h1 className="text-2xl font-bold mb-4">Title</h1>
				<div className="mb-4">
					<input
						type="text"
						placeholder="テキスト入力"
						className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex justify-end space-x-2">
					<button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full">
						<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full">
						<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
						<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}

export default UploadPage
