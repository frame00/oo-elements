const { document } = window

export default (name: string): NodeListOf<Element> =>
	document.body.getElementsByTagName(name)
