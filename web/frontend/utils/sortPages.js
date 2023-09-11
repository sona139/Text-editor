export const sortPages = (pages, sortBy) => {
	switch (sortBy) {
		case "az":
			pages.sort((a, b) => a.title.localeCompare(b.title));
			break;

		case "za":
			pages.sort((a, b) => b.title.localeCompare(a.title));
			break;

		case "oldest":
			pages.sort(
				(a, b) =>
					new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
			);
			break;

		case "newest":
			pages.sort(
				(a, b) =>
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
			);
			break;
		default:
	}
	return pages;
};
