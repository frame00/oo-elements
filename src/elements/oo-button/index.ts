import {html} from 'lit-html'
import render from '../../lib/render'
import vars from '../../style/vars'
import oo from '../../html/oo'

const ATTR = {
	DATA_SIZE: 'data-size',
	DATA_IAM: 'data-iam'
}

export default class extends HTMLElement {
	state: {
		size: 'small' | 'medium' | string,
		iam: string
	}

	static get observedAttributes() {
		return [ATTR.DATA_SIZE, ATTR.DATA_IAM]
	}

	constructor() {
		super()
		const size = this.getAttribute(ATTR.DATA_SIZE)
		const iam = this.getAttribute(ATTR.DATA_IAM)
		this.state = {size, iam}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		switch(attr) {
			case ATTR.DATA_SIZE:
				this.state.size = next
				break
			case ATTR.DATA_IAM:
				this.state.iam = next
				break
			default:
				break
		}
		this.render()
	}

	html(size, iam) {
		return html`
		<style>
			button {
				display: flex;
			    align-items: stretch;
				padding: 0;
				border: none;
				outline: none;
				cursor: pointer;
				background-color: transparent;
				appearance: none;
			}
			.text {
				display: flex;
				align-items: center;
				justify-content: center;
				color: black;
			}
		</style>
		<button>
			${oo(size)}
			<div class=text style='background: ${vars.yellow}'>Offer Me</div>
		</button>
		`
	}

	render() {
		render(this.html(this.state.size, this.state.iam), this)
	}
}
