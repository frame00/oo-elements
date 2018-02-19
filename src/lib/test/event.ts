import customEvent from '../custom-event'

export default (element: Element, eventname: string, detail?: any): void => {
	if (detail === undefined) {
		element.dispatchEvent(customEvent(eventname))
	} else {
		element.dispatchEvent(customEvent(eventname, detail))
	}
}
