export async function insertUserData(
	name: string,
	email: string,
): Promise<void> {
	try {
		const response = await fetch("http://localhost:3000/api/db/userSave", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email }),
		});

		if (!response.ok) {
			throw new Error("Failed to insert user data");
		}
	} catch (error) {
		throw error;
	}
}
