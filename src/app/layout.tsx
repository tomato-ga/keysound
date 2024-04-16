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

const noto = Noto_Sans_JP({ subsets: ['latin'] })

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
					<main className="w-full md:w-full p-2 bg-white order-1 md:order-2">
						<NextAuthProvider>{children}</NextAuthProvider>
					</main>
					<Sidebar />
				</div>
				<Footer />
			</body>
		</html>
	)
}
