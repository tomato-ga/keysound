export async function insertUserData(name: string, email: string, image?: string): Promise<void> {
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
			console.log(data.message) // レスポンスのメッセージをコンソールに出力
		} else if (response.status === 400) {
			console.log('ユーザーは既に存在します')
		} else {
			throw new Error('Failed to insert user data')
		}
	} catch (error) {
		throw error
	}
}
