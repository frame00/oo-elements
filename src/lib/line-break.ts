export default (text?: string): string[] => {
	if (text === undefined) {
		return []
	}
	return text.split(/\r\n|\n|\r/)
}
