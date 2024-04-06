export async function insertUserData(name: string, email: string): Promise<void> {
	try {
		const response = await fetch('http://localhost:3000/api/db/userSave', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email })
		})

		if (response.ok) {
			// ユーザー挿入が成功した場合
			console.log('ユーザーログイン完了')
		} else if (response.status === 400) {
			// ユーザーが既に存在する場合
			console.log('ユーザーは既に存在します')
		} else {
			// その他のエラーの場合
			throw new Error('Failed to insert user data')
		}
	} catch (error) {
		throw error
	}
}
