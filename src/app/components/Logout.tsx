import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'

export default function Logout() {
	const { data: session, status } = useSession()

	if (status === 'authenticated') {
		return (
			<div className="flex justify-center items-center">
				<button
					onClick={() => signOut()}
					className="flex items-center bg-white text-gray-600 border border-gray-300 rounded-md px-6 py-3 text-base font-bold cursor-pointer hover:bg-gray-100 transition duration-300"
				>
					<div className="flex justify-center items-center w-6 h-6 mr-3 text-blue-600 text-lg">
						<FaGoogle />
					</div>
					<span>ログアウトする</span>
				</button>
			</div>
		)
	}
	redirect('/')

	return null
}
