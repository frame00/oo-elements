import { render } from 'lit-html'
import { html } from './html'
const { document } = window

const template = html`<div style="padding: 16px; background: gray; color: black; font-style: italic;">Your browser is not supported.</div>`

export default (name: string) => {
	const els = Array.from(document.getElementsByTagName(name))
	for (const el of els) {
		render(template, el)
	}
}
