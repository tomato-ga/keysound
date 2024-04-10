export interface DefaultSession {
	user?: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
	expires: ISODateString
}

export interface PostView {
	id: string
	title: string
	description: string
	imageUrl?: string
	videoUrl?: string
	createdat: string
	user: {
		name: string
		image?: string
	}
}

export interface PostsProps {
	posts: Post[]
	componentType: 'top' | 'profile'
}
