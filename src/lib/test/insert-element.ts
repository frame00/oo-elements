const {document} = window

export default (name: string): HTMLElement => {
	const el = document.createElement(name)
	return document.body.appendChild(el)
}
