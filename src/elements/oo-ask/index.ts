import {html} from 'lit-html'
import render from '../../lib/render'

const ATTR = {
	DATA_IAM: 'data-iam'
}

const iam: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.render()
	}

	html(uid: string) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		`
	}

	render() {
		render(this.html(iam.get(this)), this)
	}
}
