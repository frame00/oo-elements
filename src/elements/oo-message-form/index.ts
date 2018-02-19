import {html, render} from '../../lib/html'
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
import weakMap from '../../lib/weak-map'
import customEvent from '../../lib/custom-event'

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
	MESSAGE_VARIATION_ERROR: (detail: MessageVariationErrorDetail): MessageVariationError => customEvent('messagevariationerror', detail),
	MESSAGE_SENT: (detail: MessageSentDetail): MessageSent => customEvent('messagesent', detail),
	MESSAGE_CREATION_FAILED: detail => customEvent('messagecreationfailed', detail)
}

const messageAuthor = weakMap<string>()
const messageExtensions = weakMap<OOExtensionsLikeObject>()
const messageBodyExtensions = weakMap<OOExtensionsLikeObject>()
const messageBody = weakMap<string>()
const fetching = weakMap<boolean>()
const success = weakMap<boolean>()
const message = weakMap<MessageOptionsPost>()
const tipsOpen = weakMap<boolean>()

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

	html(isFetching: boolean, isSuccess: boolean, open: boolean) {
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
			@import '../../style/_reset-button.css';
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
			.tip {
				width: 100%;
				box-sizing: border-box;
				margin-bottom: 1rem;
				padding: 1rem;
				background: whitesmoke;
				font-size: 0.8rem;
				border-radius: 5px;
			}
			button {
				text-transform: capitalize;
			}
			article {
				margin-top: 1rem;
				&.close {
					display: none;
				}
			}
		</style>
		<form on-submit='${() => this.sendMessage()}'>
			<textarea on-change='${e => this.onMessageChange(e)}'></textarea>
			<div class=tip>
				<button on-click='${e => this.toggleTips(e)}'>tips: ${open ? '📕' : '📖'}</button>
				<article class$='${open ? 'open' : 'close'}'>
					# Create a payment message by writing TOML format between "+++" and "+++".<br/>
					e.g.<br/>
					+++<br/>
					type = 'pay'<br/>
					amount = 10.00<br/>
					currency = 'usd' or 'jpy'<br/>
					+++
				</article>
			</div>
			<oo-atoms-button on-clicked='${() => this.sendMessage()}' data-state$='${state}'>Send a message</oo-atoms-button>
		</form>
		`
	}

	render() {
		render(this.html(fetching.get(this), success.get(this), tipsOpen.get(this)), this)
	}

	toggleTips(e: HTMLElementEvent<HTMLButtonElement>) {
		e.preventDefault()
		tipsOpen.set(this, !Boolean(tipsOpen.get(this)))
		this.render()
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
