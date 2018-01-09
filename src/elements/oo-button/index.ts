import {html} from 'lit-html'
import render from '../../lib/render'
import oo from '../atoms/oo-atoms-badge'
import define from '../../lib/define'

define('oo-atoms-badge', oo)

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
		size = size || 'medium'
		return html`
		<style>
			:host {
				display: block;
			}
			button {
				display: flex;
				align-items: stretch;
				padding: 0;
				border: none;
				outline: none;
				cursor: pointer;
				background-color: transparent;
				appearance: none;
				border-radius: 6px;
				overflow: hidden;
				transition-property: box-shadow;
				transition-duration: 0.2s;
			}
			button {
				&:hover {
					box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
				}
				&.small {
					border-radius: 3px;
					&:hover {
						box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
					}
				}
			}
			.text {
				display: flex;
				padding: 0 2rem;
				align-items: center;
				justify-content: center;
				color: black;
				font-family: "Helvetica Neue", Roboto, Arial, sans-serif;
				font-weight: 400;
				font-size: 1.4rem;
				letter-spacing: 0.05rem;
				background: #ffd600;
			}
			.small {
				.text {
					padding: 0 0.6rem;
					font-size: 0.7rem;
					font-weight: 500;
				}
			}
		</style>
		<button title='Click to send me an offer' class$=${size}>
			<oo-atoms-badge data-size$=${size}></oo-atoms-badge>
			<div class=text>Offer Me</div>
		</button>
		`
	}

	render() {
		render(this.html(this.state.size, this.state.iam), this)
	}
}
