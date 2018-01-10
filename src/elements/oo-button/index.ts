import {html} from 'lit-html'
import render from '../../lib/render'
import badge from '../_atoms/oo-atoms-badge'
import offerModal from '../_organisms/oo-organisms-offer-modal'
import define from '../../lib/define'

define('oo-atoms-badge', badge)
define('oo-organisms-offer-modal', offerModal)

type Size = 'small' | 'medium'

const ATTR = {
	DATA_SIZE: 'data-size',
	DATA_IAM: 'data-iam'
}
const asValidString = (data: string): Size => {
	if (data === 'small' || data === 'medium') {
		return data
	}
	return 'medium'
}

export default class extends HTMLElement {
	state: {
		size: Size,
		iam: string,
		open: boolean
	}

	static get observedAttributes() {
		return [ATTR.DATA_SIZE, ATTR.DATA_IAM]
	}

	constructor() {
		super()
		const size = asValidString(this.getAttribute(ATTR.DATA_SIZE))
		const iam = this.getAttribute(ATTR.DATA_IAM)
		const open = false
		this.state = {size, iam, open}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		switch(attr) {
			case ATTR.DATA_SIZE:
				this.state.size = asValidString(next)
				break
			case ATTR.DATA_IAM:
				this.state.iam = next
				break
			default:
				break
		}
		this.render()
	}

	html(size, iam, open) {
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			button {
				display: flex;
				align-items: stretch;
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
				font-weight: 400;
				font-size: 1.4rem;
				letter-spacing: 0.05rem;
				background: #ffd600;
				font-family: var(--font-family);
			}
			.small {
				.text {
					padding: 0 0.6rem;
					font-size: 0.7rem;
					font-weight: 500;
				}
			}
		</style>
		<button title='Click to send me an offer' class$=${size} onclick=${() => this.onClickButton()}>
			<oo-atoms-badge data-size$=${size}></oo-atoms-badge>
			<div class=text>Offer Me</div>
		</button>
		<oo-organisms-offer-modal data-open$=${open ? 'enabled' : 'disabled'}></oo-organisms-offer-modal>
		`
	}

	render() {
		render(this.html(this.state.size, this.state.iam, this.state.open), this)
	}

	onClickButton() {
		this.state.open = !this.state.open
		this.render()
	}
}
