export default (element: Element, eventname: string): void => {
	element.dispatchEvent(new Event(eventname))
}
