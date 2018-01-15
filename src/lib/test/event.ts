export default (element: Element, eventname: string, detail?: any): void => {
	if (detail === undefined) {
		element.dispatchEvent(new Event(eventname))
	} else {
		element.dispatchEvent(new CustomEvent(eventname, {detail}))
	}
}
