export const parserHTML = (htmlContent) => {
	const div = document.createElement("div");
	div.innerHTML = htmlContent;
	return div.textContent || "";
};
