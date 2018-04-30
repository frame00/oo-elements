const { document } = window

export default (name: string): NodeListOf<Element> => {
	const el = document.body.getElementsByTagName(name)
	return el
}
