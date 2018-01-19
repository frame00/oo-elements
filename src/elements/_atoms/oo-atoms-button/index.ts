import {html} from 'lit-html'
import render from '../../../lib/render'

export default class extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	html() {
		return html`
		<style>
			@import '../../../style/_reset-button.css';
			:host {
				display: inline-block;
			}
			button {
				padding: 1rem;
				font-size: 1.2rem;
				border-radius: 5px;
				border: 0.5px solid #ccc;
				background: white;
				&:hover {
					background: whitesmoke;
				}
			}
		</style>
		<button>
			<slot></slot>
		</button>
		`
	}

	render() {
		render(this.html(), this)
	}
}
