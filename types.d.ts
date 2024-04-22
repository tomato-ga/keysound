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
		name: string
		image?: string
	}
}

export interface PostsProps {
	posts: Post[]
	componentType: 'top' | 'profile' | null
}

export interface PostFormData {
	title: string
	description: string
	videourl?: string
	parts: PostPart[]
	tags?: string[]
}

export interface PostPart {
	case?: string
	plate?: string
	switches?: string
	keyCaps?: string
}
