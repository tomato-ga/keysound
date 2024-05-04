export interface DefaultSession {
	user?: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
	expires: ISODateString
}

export interface PostsProps {
	posts: Post[]
	componentType: 'top' | 'profile' | null
	isCurrentUser: boolean
	screenName?: string | null | undefined
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

export type PostEditFormData = {
	id: string
	title: string
	description: string
	imageUrl?: string | null
	videoUrl?: string | null
	createdat: Date
	updatedat: Date
	user: User
	part: UpdateParts | null
	category: Category | null
	screenName: string | null
}

// export interface UpdateTags {
// 	tag: {
// 		id: string
// 		name: string
// 	}
// 	postId: string
// 	tagId: string
// }

export type PostWithUserProfile = Post & {
	user: User & {
		profile: Profile | null
	}
}

export interface User {
	id: string
	name: string
	image?: string
}

export interface Profile {
	id: string
	bio: string | null
	screenName: string | null
	userId: string
}

export interface Post {
	id: string
	title: string
	description: string
	imageUrl?: string | null
	videoUrl?: string | null
	createdat: Date
	updatedat: Date
	user: User
	categoryId?: string | null
}

export interface TopPostsProps {
	posts: PostWithUserProfile[]
}

export interface ProfilePostsProps {
	posts: Post[]
	isCurrentUser: boolean
	screenName: string
}
