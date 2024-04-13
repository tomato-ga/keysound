// src/stores/useSidebarStore.ts
import { create } from 'zustand'

interface SidebarState {
	sidebarOpen: boolean
	toggleSidebar: () => void
}

const useSidebarStore = create<SidebarState>((set) => ({
	sidebarOpen: false,
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}))

export default useSidebarStore
