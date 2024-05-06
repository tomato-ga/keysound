// LoginPage.tsx
'use client'
import React, { useEffect, useState } from 'react'
import Login from '@/app/components/Login'
import Logout from '@/app/components/Logout'
import { useSession } from 'next-auth/react'
import { insertUserData } from '@/app/func/dbUserInsert'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const LoginPage = () => {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [profileData, setProfileData] = useState<{
		userExists: boolean
		user?:
			| ({ profile?: { id: string; bio: string | null; screenName: string | null; userId: string } | null } & {
					id: string
					name: string
					email: string
					image: string
					createdat: Date
					updatedat: Date
			  })
			| undefined
	} | null>(null)

	useEffect(() => {
		const fetchProfileData = async () => {
			if (status === 'authenticated' && session) {
				const email = session.user?.email || ''
				const image = session.user?.image || ''
				if (email) {
					const name = email.split('@')[0]
					try {
						const result = await insertUserData(name, email, image)
						setProfileData(result)
						setIsLoggedIn(true)
						revalidatePath('profile')
					} catch (error) {
						console.error('データ挿入時のエラー:', error)
					}
				}
			}
		}

		fetchProfileData()
	}, [status, session])

	useEffect(() => {
		if (isLoggedIn && profileData && profileData.user && profileData.user.profile) {
			router.push(`/profile/${profileData.user.profile.screenName}`)
		}
	}, [isLoggedIn, profileData])

	return (
		<div className="bg-white min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				{status === 'authenticated' && session ? (
					<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
						<div className="flex items-center justify-center mb-6">
							<img src={session.user?.image ?? ''} alt="" className="w-20 h-20 rounded-full mr-4" />
							<div>
								<p className="text-xl font-semibold text-gray-600">ようこそ、{session.user?.name}さん</p>
							</div>
						</div>
						{/* {userExists && <p className="text-green-400 font-bold mb-4 text-center">ログインしています</p>} */}
						<div className="text-center">
							<Logout />
						</div>
					</div>
				) : (
					<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-gray-700 text-2xl font-semibold mb-6 text-center">ログインする</h2>
						<Login />
					</div>
				)}
			</div>
		</div>
	)
}

export default LoginPage
