export interface DefaultSession {
	user?: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
	expires: ISODateString
}

export interface Post {
	id: string
	title: string
	description: string
	imageUrl?: string | null
	videoUrl?: string | null
	createdat: Date
	updatedat: Date
	user: {
		id: string
		name: string
		image?: string
	}
}

export interface PostsProps {
	posts: Post[]
	componentType: 'top' | 'profile' | null
	isCurrentUser: boolean
}

export interface PostFormData {
	title: string
	description: string
	videourl?: string
	parts: PostPart[]
	category: string
	// tags?: string[]
}

export interface PostPart {
	case?: string
	plate?: string
	switches?: string
	keyCaps?: string
}

export interface UpdateParts {
	id: string
	case: string
	plate: string
	switches: string
	keyCaps: string
	postId: string
}

export type PostEditFormData = Omit<Post, 'user'> & {
	part: UpdateParts | null
	category: string
	// tags: UpdateTags[] | string[]
}

// export interface UpdateTags {
// 	tag: {
// 		id: string
// 		name: string
// 	}
// 	postId: string
// 	tagId: string
// }