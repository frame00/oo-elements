import {html} from 'lit-html'
import render from '../../lib/render'

const {PACKAGE_VERSION: version} = process.env

export default class extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	html(v: string) {
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: inline-block;
			}
			span {
				font-family: var(--font-family);
			}
		</style>
		<span>${v}</span>
		`
	}

	render() {
		render(this.html(version), this)
	}
}
