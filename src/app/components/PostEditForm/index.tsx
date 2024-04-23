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

	return (
		<>
			{/* TODO: UploadPageを再利用するのではなく、その下にあるコンポーネントを再利用する */}
			{/* <PostsCard posts={posts} componentType="profile" /> */}
		</>
	)
}

export default PostEditForm
