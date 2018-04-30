const { document, customElements } = window
const { attachShadow } = document.body

export default (): boolean => {
	if (!attachShadow || !customElements) {
		return true
	}
	return false
}
