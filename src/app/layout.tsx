// /Users/donbe/Codes/keysound/src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import NextAuthProvider from '@/providers/nextauth'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/auth/[...nextauth]'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['500'] })

export const metadata: Metadata = {
	title: 'keyboard sound',
	description: 'キーボードの「音」に特化したサイト'
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session: Session | null = await getServerSession(authOptions)

	return (
		<html lang="ja">
			<body className={noto.className}>
				<Header session={session} />
				<div className="mx-auto flex flex-col md:flex-row justify-between md:justify-start min-h-screen bg-white">
					<Sidebar />
					<main className="w-full md:w-3/4 p-2 bg-white order-1 md:order-2">
						<NextAuthProvider>{children}</NextAuthProvider>
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar
							newestOnTop
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							style={{ width: '500px' }}
						/>
					</main>
				</div>
				<Footer />
			</body>
		</html>
	)
}
