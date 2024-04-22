'use client'
import { prisma } from '@/app/lib/prisma'
import { Post } from '../../../../types'
import PostsCard from '@/app/components/PostsCard'

interface PostEditFormProps {
	posts: Post[]
}

// Post.idからデータを取得してpropsでここのコンポーネントPostEditFormに渡す
// 編集したい項目を修正してprisma Post.idで更新する

const PostEditForm: React.FC<PostEditFormProps> = ({ posts }) => {
	const updatePost = async () => {
		// 更新処理を実装する
	}

	return (
		<>
			{posts.map((post: Post) => (
				<PostsCard key={post.id} post={post} componentType="profile" />
			))}
		</>
	)
}

export default PostEditForm
