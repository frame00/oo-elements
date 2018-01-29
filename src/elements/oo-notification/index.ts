import {html} from 'lit-html'
import render from '../../lib/render'

export default class extends HTMLElement {
	constructor() {
		super()
		setTimeout(() => {
			this.parentElement.removeChild(this)
		}, 3000)
	}

	html() {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<main>
			<slot name=body></slot>
		</main>
		`
	}

	render() {
		render(this.html(), this)
	}
}
