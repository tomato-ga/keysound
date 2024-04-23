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
	console.log(posts)

	// TODO ポストを表示するのではなく、編集できるようにする
	return (
		<>
			<PostsCard posts={posts} componentType="profile" />
		</>
	)
}

export default PostEditForm
