export const getDateVisible = `${new Date().toLocaleDateString()}, ${new Date()
	.toLocaleTimeString()
	.slice(0, 4)} ${new Date().toLocaleTimeString().slice(-3)} EDT)`;
