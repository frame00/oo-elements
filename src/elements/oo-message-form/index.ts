import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import userName from '../_atoms/oo-atoms-user-name'
import datetime from '../_atoms/oo-atoms-datetime'
import button from '../_atoms/oo-atoms-button'
import {OOExtensions} from '../../d/oo-extension'

define('oo-atoms-button', button)
define('oo-atoms-user-name', userName)
define('oo-atoms-datetime', datetime)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_EXTENSIONS: 'data-extensions'
}
const EVENT = {
	MESSAGE_SENT: new Event('messagesent')
}

const messageAuthor: WeakMap<object, string> = new WeakMap()
const messageExtensions: WeakMap<object, OOExtensions> = new WeakMap()
const messageBody: WeakMap<object, string> = new WeakMap()

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
				break
		}
		this.render()
	}

	html() {
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-textarea.css';
			:host {
				display: block;
			}
			form {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
			}
			textarea {
				@mixin textarea;
				margin-bottom: 1rem;
			}
			oo-atoms-button {}
		</style>
		<form on-submit='${e => this.messageSend(e)}'>
			<textarea on-change='${e => this.onMessageChange(e)}'></textarea>
			<oo-atoms-button on-click='${e => this.messageSend(e)}'>Send a message</oo-atoms-button>
		</form>
		`
	}

	render() {
		render(this.html(), this)
	}

	onMessageChange(e: HTMLElementEvent<HTMLTextAreaElement>) {
		const {target} = e
		const {value} = target
		if (value) {
			messageBody.set(this, value)
		}
	}

	async messageSend(e: HTMLElementEvent<HTMLFormElement>) {
		console.log(e)
		this.dispatchEvent(EVENT.MESSAGE_SENT)
	}
}
