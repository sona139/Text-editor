export const validDate = (date) => {
	return new Date(date).toDateString().slice(4);
};
