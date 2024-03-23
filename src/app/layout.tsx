import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import NextAuthProvider from '@/providers/nextauth'

const noto = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'keyboard sound',
	description: 'キーボードの「音」に特化したサイト'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ja">
			<body className={noto.className}>
				<Header />
				<NextAuthProvider>{children}</NextAuthProvider>
			</body>
		</html>
	)
}
