import {html} from 'lit-html'
import render from '../../../lib/render'

const ATTR = {
	DATA_UNIXTIME: 'data-unixtime'
}

const unixtime: WeakMap<object, number> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UNIXTIME]
	}

	attributeChangedCallback(attr, prev, next) {
		unixtime.set(this, Number(next))
		this.render()
	}

	html(time: string) {
		return html`
		<style>
			@import '../../../style/_vars-font-family.css';
			span {
				font-family: var(--font-family);
			}
		</style>
		<span>${time}</span>
		`
	}

	render() {
		const unix = unixtime.get(this)
		const date = new Date(unix)
		const localDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
		render(this.html(localDateTime), this)
	}
}
