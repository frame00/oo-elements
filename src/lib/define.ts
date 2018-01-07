const {customElements} = window

export default (name: string, element: Function): void => {
	if (customElements.get(name) === undefined) {
		customElements.define(name, element)
	}
}
