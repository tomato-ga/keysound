export interface DefaultSession {
	user?: {
		name?: string | null
		email?: string | null
		image?: string | null
	}
	expires: ISODateString
}
