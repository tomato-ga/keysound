// generatePostMetadata.ts
import { PostWithDetails } from "../../../../types"

export const generatePostMetadata = (post: PostWithDetails | null) => {
	const siteName = 'キーボードサウンド'
	if (!post) {
		return {
			title: `Post not found | ${siteName}`,
			description: 'The requested post does not exist.'
		}
	}

	return {
		title: `${post.title} | ${siteName}`,
		description: post.description.substring(0, 150),
		openGraph: {
			title: `${post.title} | ${siteName}`,
			description: post.description,
			images: [
				{
					url: post.user.image || '/default-avatar.jpg',
					alt: post.user.profile?.screenName ?? 'User profile image'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: `${post.title} | ${siteName}`,
			description: post.description,
			image: post.user.image || '/default-avatar.jpg'
		}
	}
}
