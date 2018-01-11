export default (el: HTMLElement, name: string = 'data-test'): string | void => {
	if (el.hasAttribute(name)) {
		return el.getAttribute(name)
	}
	return undefined
}
