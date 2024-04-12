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
				<div className="flex">
					<Sidebar />
					<div className="flex-1">
						<NextAuthProvider>{children}</NextAuthProvider>
						<Footer />
					</div>
				</div>
			</body>
		</html>
	)
}
