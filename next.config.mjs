/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*', // ワイルドカードを使う
				port: ''
			}
		]
	},
	api: {
		bodyParser: {
			sizeLimit: '200mb' // APIリクエストボディのサイズ制限を100MBに設定
		}
	}
}

export default nextConfig
