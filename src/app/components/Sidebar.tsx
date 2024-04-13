// Sidebar.tsx
'use client'
import React, { useEffect, useState } from 'react'
import SideCategoryLinks from './SideCategoryLinks'
import useSidebarStore from '../stores/useSiderbar'

const Sidebar: React.FC = () => {
	const sidebarOpen = useSidebarStore((state) => state.sidebarOpen)
	const [isLargeScreen, setIsLargeScreen] = useState(false)

	useEffect(() => {
		const updateScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 1280)
			console.log('Current screen width:', window.innerWidth, 'Is large screen:', isLargeScreen)
		}
		window.addEventListener('resize', updateScreenSize)
		updateScreenSize()
		return () => window.removeEventListener('resize', updateScreenSize)
	}, [])

	console.log('Sidebar open:', sidebarOpen)

	return (
		<>
			{(sidebarOpen || isLargeScreen) && (
				<div
					className={`bg-gray-800 p-4 transform ${
						sidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-20 ${
						isLargeScreen ? 'xl:translate-x-0' : ''
					}`}
				>
					<div className="text-gray-300">
						<SideCategoryLinks />
					</div>
				</div>
			)}
		</>
	)
}

export default Sidebar
