// generatePostMetadata.ts
import { PostWithDetails } from '../../../../types'

export const generatePostMetadata = (post: PostWithDetails | null) => {
	const siteName = 'キーボードサウンド'
	const defaultImage = '/opengraph-image.jpg' // デフォルトのOGP画像
	const defaultTwitterImage = '/twitter-image.jpg' // デフォルトのTwitterカード画像

	if (!post) {
		return {
			title: `Post not found | ${siteName}`,
			description: 'The requested post does not exist.',
			openGraph: {
				title: `Post not found | ${siteName}`,
				description: 'The requested post does not exist.',
				images: [
					{
						url: defaultImage,
						alt: 'Default image'
					}
				]
			},
			twitter: {
				card: 'summary_large_image',
				title: `Post not found | ${siteName}`,
				description: 'The requested post does not exist.',
				image: defaultTwitterImage
			}
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
					url: defaultImage,
					alt: post.user.profile?.screenName ?? 'User profile image'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: `${post.title} | ${siteName}`,
			description: post.description,
			image: defaultTwitterImage
		}
	}
}
