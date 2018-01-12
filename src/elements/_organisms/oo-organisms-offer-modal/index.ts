import {html} from 'lit-html'
import render from '../../../lib/render'
import ooModal from '../../oo-modal'
import define from '../../../lib/define'

define('oo-modal', ooModal)

const ATTR = {
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

const open: WeakMap<object, boolean> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_OPEN]
	}

	constructor() {
		super()
		open.set(this, asBoolean(this.getAttribute(ATTR.DATA_OPEN)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		open.set(this, asBoolean(next))
		this.render()
	}

	html(o: boolean) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<oo-modal data-open$=${o ? 'enabled' : 'disabled'}>
			<div slot=body>WIP</div>
		</oo-modal>
		`
	}

	render() {
		render(this.html(open.get(this)), this)
	}
}
