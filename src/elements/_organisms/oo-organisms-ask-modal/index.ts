import {html, render} from '../../../lib/html'
import ooOffer from '../../oo-ask'
import ooModal from '../../oo-modal'
import define from '../../../lib/define'

define('oo-ask', ooOffer)
define('oo-modal', ooModal)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_OPEN: 'data-open'
}
const EVENT = {
	CLOSE: new Event('close')
}

const asBoolean = (data: string): boolean => {
	switch(data) {
		case 'enabled':
			return true
		case 'disabled':
			return false
		default:
			return false
	}
}

const iam: WeakMap<object, string> = new WeakMap()
const open: WeakMap<object, boolean> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_OPEN]
	}

	constructor() {
		super()
		open.set(this, asBoolean(this.getAttribute(ATTR.DATA_OPEN)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				if (!next) {
					return
				}
				iam.set(this, next)
				break
			case ATTR.DATA_OPEN:
				open.set(this, asBoolean(next))
				break
			default:
				break
		}
		this.render()
	}

	html(i: string, o: boolean) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<oo-modal data-open$='${o ? 'enabled' : 'disabled'}' on-close='${() => this.onModalClose()}'>
			<div slot=body>
				<oo-ask data-iam$=${i}></oo-ask>
			</div>
		</oo-modal>
		`
	}

	render() {
		render(this.html(iam.get(this), open.get(this)), this)
	}

	onModalClose() {
		open.set(this, false)
		this.render()
		this.dispatchEvent(EVENT.CLOSE)
	}
}
