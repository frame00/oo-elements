import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import message from '../_atoms/oo-atoms-message'
import userName from '../_atoms/oo-atoms-user-name'
import datetime from '../_atoms/oo-atoms-datetime'
import {OOExtensions} from '../../d/oo-extension'

define('oo-atoms-message', message)
define('oo-atoms-user-name', userName)
define('oo-atoms-datetime', datetime)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_EXTENSIONS: 'data-extensions'
}
const EVENT = {
	MESSAGE_SENT: new Event('messagesent')
}

const messageAuthor: WeakMap<object, string> = new WeakMap()
const messageExtensions: WeakMap<object, OOExtensions> = new WeakMap()

const asExtensions = (data: string): OOExtensions => {
	try {
		const json: OOExtensions = JSON.parse(data)
		return json
	} catch(err) {
		console.log(err)
	}
	return []
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_EXTENSIONS]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				messageAuthor.set(this, next)
				break
			case ATTR.DATA_EXTENSIONS:
				messageExtensions.set(this, asExtensions(next))
				break
			default:
		}
		this.render()
	}

	html() {
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
		</style>
		`
	}

	render() {
		render(this.html(), this)
	}

	async messageSend() {
		this.dispatchEvent(EVENT.MESSAGE_SENT)
	}
}
