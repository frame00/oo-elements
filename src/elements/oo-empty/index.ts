import {html} from 'lit-html'
import render from '../../lib/render'
import empty from '../../lib/svg/empty'

export default class extends HTMLElement {
	constructor() {
		super()
		this.render()
	}

	html() {
		return html`
		<style>
			figure {
				display: flex;
			}
		</style>
		<figure>
			${empty()}
		</figure>
		`
	}

	render() {
		render(this.html(), this)
	}
}
