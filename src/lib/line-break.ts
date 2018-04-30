export default (text?: string): string[] => {
	if (text === undefined) {
		return []
	}
	const lines = text.split(/\r\n|\n|\r/)
	return lines
}
