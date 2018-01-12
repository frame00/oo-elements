export default (text?: string): Array<string> => {
	if (text === undefined) {
		return []
	}
	const lines = text.split(/\r\n|\n|\r/)
	return lines
}
