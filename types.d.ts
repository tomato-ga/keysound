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
	youtube?: string
	parts: PostPart[]
	category: string
	thumbnail?: string
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
	email?: string
	image?: string
	createdat: Date
	updatedat: Date
	profile?: Profile | null
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
	youtube?: string | null
	thumbnail?: string | null
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

// PostWithDetailsと関連する型定義
export interface PostWithDetails extends Omit<Post, 'user'> {
	user: {
		profile: {
			screenName: string | null
		} | null
		image: string | null
	}
	part: {
		case: string | null
		plate: string | null
		switches: string | null
		keyCaps: string | null
	} | null
}

export interface PostContentProps {
	post: PostWithDetails
	isCurrentUser: boolean
	videoUrl: string | null
}

export interface PostHeaderProps {
	post: PostWithDetails
	isCurrentUser: boolean
}

export interface PostPartsProps {
	part: PostWithDetails['part']
}
