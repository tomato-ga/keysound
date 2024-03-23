import Image from 'next/image'
import Session from './components/Session'

export default function Home() {
	return (
		<div className="text-[50px]">
			ホームだよ
			<Session />
		</div>
	)
}
