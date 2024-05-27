// fetchPostData.ts
import { prisma } from '@/app/lib/prisma';
import { PostWithDetails } from '../../../../types';

export const fetchPostData = async (postId: string): Promise<PostWithDetails | null> => {
	const post = await prisma.post.findUnique({
		where: { id: postId },
		include: {
			user: { include: { profile: true } },
			part: true
		}
	});

	if (!post) return null;

	return {
		...post,
		user: {
			profile: post.user.profile ? { screenName: post.user.profile.screenName } : null,
			image: post.user.image
		},
		part: post.part
	} as PostWithDetails;
};
