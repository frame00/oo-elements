import {OOElement} from '../../oo-element'
import {html} from '../../../lib/html'
import ooOffer from '../../oo-ask'
import ooModal from '../../oo-modal'
import define from '../../../lib/define'
import weakMap from '../../../lib/weak-map'
import {asTags} from '../../../lib/as'

define('oo-ask', ooOffer)
define('oo-modal', ooModal)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_TAGS: 'data-tags',
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

const iam = weakMap<string>()
const open = weakMap<boolean>()
const tags = weakMap<Array<string>>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_OPEN, ATTR.DATA_TAGS]
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
			case ATTR.DATA_TAGS:
				tags.set(this, asTags(next))
				break
			default:
				break
		}
		if (this.connected) {
			this.update()
		}
	}

	render() {
		const i = iam.get(this)
		const o = open.get(this)
		const t = tags.get(this) || []
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<oo-modal data-open$='${o ? 'enabled' : 'disabled'}' on-close='${() => this.onModalClose()}'>
			<div slot=body>
				<oo-ask data-iam$='${i}' data-tags$='${t.join(' ')}'></oo-ask>
			</div>
		</oo-modal>
		`
	}

	onModalClose() {
		open.set(this, false)
		this.update()
	}
}
