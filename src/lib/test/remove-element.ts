import getElement from './get-element'

export default (name: string): boolean => {
	try {
		const els = getElement(name)
		Array.prototype.forEach.call(els, el => {
			el.parentNode.removeChild(el)
		})
		return true
	} catch (err) {
		console.error(err)
	}
	return false
}
