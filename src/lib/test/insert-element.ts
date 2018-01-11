const {document} = window

export default (name: string, attrs?: Map<string, string>): HTMLElement => {
	const el = document.createElement(name)

	if(attrs !== undefined) {
		for(const attr of attrs) {
			const [key, value] = attr
			el.setAttribute(key, value)
		}
	}

	return document.body.appendChild(el)
}
