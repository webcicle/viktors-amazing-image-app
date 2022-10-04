export const getFormatDate = (date: string) => {
	const dateString = date.toString().split('T').shift();
	const hours = date.toString().split('T').pop()?.split(':')[0];
	const minutes = date.toString().split('T').pop()?.split(':')[1];
	return `${dateString}, ${hours}:${minutes}`;
};
