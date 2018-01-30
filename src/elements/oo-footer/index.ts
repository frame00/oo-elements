import {html} from 'lit-html'
import render from '../../lib/render'

export default class extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	html() {
		return html`
		<style>
			@import '../../style/_vars-color-yellow.css';
			:host {
				display: block;
			}
			::slotted(a) {
				margin: 0 1rem;
				padding: 1rem 0;
				text-decoration: none;
				color: var(--yellow);
			}
		</style>
		<footer>
			<slot name=item></slot>
		</footer>
		`
	}

	render() {
		render(this.html(), this)
	}
}
