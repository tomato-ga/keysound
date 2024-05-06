// LoginPage.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/func/dbUserInsert'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const LogoutPage = () => {
	return (
		<div className="bg-white min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<Logout />
				</div>
			</div>
		</div>
	)
}

export default LogoutPage
