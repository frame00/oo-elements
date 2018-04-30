export default (
	element: HTMLElement,
	slotParent: string,
	slot: string,
	selector: string
): Element => {
	const slotBody = element.shadowRoot
		.querySelector(slotParent)
		.shadowRoot.querySelector(slot)
	const [assigned] = slotBody.assignedNodes()
	const result = assigned.firstChild.parentElement.querySelector(selector)
	return result
}
