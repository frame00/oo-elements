const {document} = window

const template = '<div style="padding: 16px; background: gray; color: black; font-style: italic;">Your browser is not supported.</div>'

export default (name: string) => {
	const els = Array.from(document.getElementsByTagName(name))
	for (const el of els) {
		el.innerHTML = template
	}
}
