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
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			footer {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
			}
			::slotted(a) {
				margin: 0 1rem;
				padding: 1rem 0;
				text-decoration: none;
				color: color(var(--yellow) blend(red 20%));
				font-size: 0.8rem;
				font-family: var(--font-family);
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
