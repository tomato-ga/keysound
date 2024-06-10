import React from 'react'
import AdminHeader from '../admincomponent/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AdminHeader />
			<div className="admin-content">{children}</div>
		</>
	)
}
