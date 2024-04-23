'use client'

import { prisma } from '@/app/lib/prisma'
import { Post } from '../../../../types'

type PostWithoutUser = Omit<Post, 'user'>
interface PostEditFormProps {
	post: PostWithoutUser
}

const PostEditForm: React.FC<PostEditFormProps> = ({ post }) => {
	console.log('post', post)

	// TODO Input系のコンポーネント呼び出し

	return <>はろーコンポーネント修正中だよ</>
}

export default PostEditForm
