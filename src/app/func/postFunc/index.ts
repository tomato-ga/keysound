// src/app/func/utils.ts
export const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${year}/${month}/${day}`;
};

export const truncateDescription = (
	description: string,
	maxLength: number = 100,
) => {
	if (description.length <= maxLength) {
		return description;
	}
	return description.slice(0, maxLength) + "...";
};
