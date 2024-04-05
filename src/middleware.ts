// MEMO ルートディレクトリにmiddleware.tsを配置して指定matcherのページにアクセスしてログインしていなかったらリダイレクトする

export { default } from 'next-auth/middleware'

export const config = {
	matcher: ['/profile']
}
