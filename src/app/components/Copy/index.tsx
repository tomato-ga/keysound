import React from 'react'

const TopCopy = () => {
	return (
		<div className="text-gray-800 flex flex-col items-center justify-center p-4 h-96 md:h-[15vh] lg:h-[15vh] overflow-visible">
			<h1 className="text-6xl sm:text-5vw lg:text-7xl font-extrabold text-center leading-normal">
				<span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
					Enjoy Keyboard Sounds
				</span>
			</h1>
			<p className="text-2xl text-center mt-4">キーボードの打鍵音投稿サイト</p>
		</div>
	)
}

export default TopCopy
