import {html} from 'lit-html'
import render from '../../../lib/render'
import ooOffer from '../../oo-offer'
import ooModal from '../../oo-modal'
import define from '../../../lib/define'

define('oo-offer', ooOffer)
define('oo-modal', ooModal)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_OPEN: 'data-open'
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
		<oo-modal data-open$=${o ? 'enabled' : 'disabled'}>
			<div slot=body>
				<oo-offer data-iam$=${i}></oo-offer>
			</div>
		</oo-modal>
		`
	}

	render() {
		render(this.html(iam.get(this), open.get(this)), this)
	}
}
