// src/stores/useSidebarStore.ts

import { create } from 'zustand'

interface SidebarState {
	sidebarOpen: boolean
	toggleSidebar: () => void
}

const useSidebarStore = create<SidebarState>((set) => ({
	sidebarOpen: false,
	toggleSidebar: () =>
		set((state) => {
			console.log('Toggling sidebar from:', state.sidebarOpen, 'to:', !state.sidebarOpen)
			return { sidebarOpen: !state.sidebarOpen }
		})
}))

export default useSidebarStore
