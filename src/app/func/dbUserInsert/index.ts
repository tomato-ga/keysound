// dbUserInsert.ts
export async function insertUserData(name: string, email: string, image?: string): Promise<{ userExists: boolean }> {
	try {
		const response = await fetch('http://localhost:3000/api/db/userSave', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, image })
		})
		if (response.ok) {
			const data = await response.json()
			console.log(data.message)
			return { userExists: false }
		} else if (response.status === 400) {
			return { userExists: true }
		} else {
			throw new Error('Failed to insert user data')
		}
	} catch (error) {
		console.error('データ挿入時のエラー:', error)
		throw error
	}
}
