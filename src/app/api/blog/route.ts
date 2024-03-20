import { NextResponse } from 'next/server'
import blogdata from '/Users/ore/Documents/GitHub/keysound/blog-data.json'

const GET = () => {
	return NextResponse.json({ blogdata })
}

export { GET }
