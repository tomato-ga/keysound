/* このコード スニペットは、React 用の小型で高速な状態管理ライブラリである Zustand を使用して、`useSidebarStore` というカスタム フックを定義する TypeScript
ファイルです。 */
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
