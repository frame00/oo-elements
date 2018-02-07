import {html, render} from '../../lib/html'
import badge from '../_atoms/oo-atoms-badge'
import offerModal from '../_organisms/oo-organisms-ask-modal'
import define from '../../lib/define'

define('oo-atoms-badge', badge)
define('oo-organisms-ask-modal', offerModal)

type Size = 'small' | 'medium'
type Type = 'ask' | 'offer'

const ATTR = {
	DATA_SIZE: 'data-size',
	DATA_IAM: 'data-iam',
	DATA_TYPE: 'data-type'
}
const asSize = (data: string): Size => {
	if (data === 'small' || data === 'medium') {
		return data
	}
	return 'medium'
}
const asType = (data: string): Type => {
	if (data === 'ask' || data === 'offer') {
		return data
	}
	return 'ask'
}

const iam: WeakMap<object, string> = new WeakMap()
const size: WeakMap<object, Size> = new WeakMap()
const open: WeakMap<object, boolean> = new WeakMap()
const type: WeakMap<object, Type> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_SIZE, ATTR.DATA_IAM, ATTR.DATA_TYPE]
	}

	constructor() {
		super()
		open.set(this, false)
		type.set(this, 'ask')
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_SIZE:
				size.set(this, asSize(next))
				break
			case ATTR.DATA_IAM:
				if (!next) {
					return
				}
				iam.set(this, next)
				break
			case ATTR.DATA_TYPE:
				type.set(this, asType(next))
				break
			default:
				break
		}
		this.render()
	}

	html(s: string, i: string, o: boolean, t: Type) {
		const label = `${t} me`

		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-font-family.css';
			@import '../../style/_vars-color-yellow.css';
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
				text-transform: capitalize;
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
				background: var(--yellow);
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
		<button title='Click to send me an offer' class$='${s}' on-click='${() => this.onClickButton()}'>
			<oo-atoms-badge data-size$='${s}'></oo-atoms-badge>
			<div class=text>${label}</div>
		</button>
		<oo-organisms-ask-modal data-iam$='${i}' data-open$='${o ? 'enabled' : 'disabled'}' on-close='${() => this.onModalClose()}'></oo-organisms-ask-modal>
		`
	}

	render() {
		if (!iam.get(this)) {
			return
		}
		render(this.html(size.get(this), iam.get(this), open.get(this), type.get(this)), this)
	}

	onClickButton() {
		open.set(this, !open.get(this))
		this.render()
	}

	onModalClose() {
		open.set(this, false)
		this.render()
	}
}
