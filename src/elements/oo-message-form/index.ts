import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import userName from '../_atoms/oo-atoms-user-name'
import datetime from '../_atoms/oo-atoms-datetime'
import button from '../_atoms/oo-atoms-button'
import {OOExtensionsLikeObject} from '../../type/oo-extension'
import createMessage from '../../lib/oo-api-create-message'
import {MessageVariationError, MessageVariationErrorDetail, MessageSentDetail, MessageSent} from '../../type/event'
import {MessageOptionsPost} from '../../type/oo-options-message'
import parseMessage from '../../lib/parse-message-body'
import {attach, dispatch} from '../../lib/notification'

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
	MESSAGE_VARIATION_ERROR: (detail: MessageVariationErrorDetail): MessageVariationError => new CustomEvent('messagevariationerror', {detail}),
	MESSAGE_SENT: (detail: MessageSentDetail): MessageSent => new CustomEvent('messagesent', {detail}),
	MESSAGE_CREATION_FAILED: detail => new CustomEvent('messagecreationfailed', {detail})
}

const messageAuthor: WeakMap<object, string> = new WeakMap()
const messageExtensions: WeakMap<object, OOExtensionsLikeObject> = new WeakMap()
const messageBodyExtensions: WeakMap<object, OOExtensionsLikeObject> = new WeakMap()
const messageBody: WeakMap<object, string> = new WeakMap()
const fetching: WeakMap<object, boolean> = new WeakMap()
const success: WeakMap<object, boolean> = new WeakMap()
const message: WeakMap<object, MessageOptionsPost> = new WeakMap()

const asExtensions = (data: string): OOExtensionsLikeObject => {
	try {
		const json: OOExtensionsLikeObject = JSON.parse(data)
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

	get message() {
		return message.get(this)
	}

	constructor() {
		super()
		attach()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
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
		this.setMessage()
		this.render()
	}

	html(isFetching: boolean, isSuccess: boolean) {
		const state = ((): string => {
			if (isFetching === false && isSuccess !== undefined) {
				return isSuccess ? 'resolved' : 'rejected'
			}
			if (isFetching === true) {
				return 'progress'
			}
			return ''
		})()

		return html`
		<style>
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
			.tip {
				margin-top: 1rem;
				padding: 1rem;
				background: whitesmoke;
				font-size: 0.8rem;
				border-radius: 5px;
			}
		</style>
		<form on-submit='${() => this.sendMessage()}'>
			<textarea on-change='${e => this.onMessageChange(e)}'></textarea>
			<oo-atoms-button on-clicked='${() => this.sendMessage()}' data-state$='${state}'>Send a message</oo-atoms-button>
		</form>
		<div class=tip>
			Tips:<br/>
			# You can create a payment message by writing TOML format between "+++" and "+++".<br/>
			e.g.<br/>
			+++<br/>
			type = 'pay'<br/>
			amount = 10.00<br/>
			currency = 'usd' or 'jpy'<br/>
			+++
		</div>
		`
	}

	render() {
		render(this.html(fetching.get(this), success.get(this)), this)
	}

	setMessage() {
		const extensions = messageExtensions.get(this)
		const bodyExtensions = messageBodyExtensions.get(this)
		const data = {
			author: messageAuthor.get(this),
			body: messageBody.get(this)
		}
		message.set(this, {...extensions, ...bodyExtensions, ...data})
	}

	onMessageChange(e: HTMLElementEvent<HTMLTextAreaElement>) {
		const {target} = e
		const {value} = target
		try {
			const parsed = parseMessage(value)
			if (parsed) {
				messageBody.set(this, parsed.body)
				messageBodyExtensions.set(this, parsed)
				this.setMessage()
			}
		} catch(err) {
			dispatch({message: `Invalid body: ${err.message}`, type: 'error'})
		}
	}

	sendMessage() {
		if (!this.message.body || this.message.body.length === 0) {
			dispatch({message: 'Empty text can not be sent.', type: 'error'})
			return this.dispatchEvent(EVENT.MESSAGE_VARIATION_ERROR({message: 'body required'}))
		}
		fetching.set(this, true)
		success.delete(this)
		this.render()
		this.messageSend()
	}

	async messageSend(test?: boolean) {
		const api = await createMessage(this.message, test)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			success.set(this, true)
			this.dispatchEvent(EVENT.MESSAGE_SENT(item))
		} else {
			success.set(this, false)
			this.dispatchEvent(EVENT.MESSAGE_CREATION_FAILED(response))
		}
		fetching.set(this, false)
		this.render()
	}
}
