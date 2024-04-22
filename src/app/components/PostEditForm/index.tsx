'use server'

import { prisma } from '@/app/lib/prisma'
import { Post } from '../../../../types'

interface PostEditFormProps extends Post {}

export const PostEditForm = async () => {
	const username = 'ah'

	// Postページからの遷移
	// Profileページからの遷移
	// ↓
	// Post.idからデータを取得してpropsでここのコンポーネントPostEditFormに渡す
	// 編集したい項目を修正してprisma Post.idで更新する
}
