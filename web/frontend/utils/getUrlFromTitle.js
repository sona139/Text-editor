export const getUrlFromTitle = (title) => {
	return title
		.trim()
		.replaceAll(/[^a-zA-Z0-9\s]/g, "")
		.split(/\s+/g)
		.join("-");
};
