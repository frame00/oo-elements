import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import summary from '../oo-project-summary'
import messages from '../oo-project-messages'
import form from '../oo-message-form'
import store from '../../lib/local-storage'
import {OOExtensionMap, OOExtensionsLikeObject} from '../../d/oo-extension'
import {HTMLElementEventMessageSent} from '../../d/event'

define('oo-project-summary', summary)
define('oo-project-messages', messages)
define('oo-message-form', form)

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()
const projectOfferer: WeakMap<object, string> = new WeakMap()
const messageForm: WeakMap<object, messages> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	constructor() {
		super()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		this.render()
	}

	html(user: string, uid: string, extensions: OOExtensionsLikeObject) {
		const strExts = JSON.stringify(extensions)
		return html`
		<style>
			oo-project-summary {
				margin-bottom: 2rem;
				border-bottom: 0.5px solid #ccc;
			}
		</style>
		<oo-project-summary data-uid$='${uid}' on-projectupdated='${e => this.onProjectFetched(e)}'></oo-project-summary>
		<oo-project-messages data-iam$='${user ? user : ''}' data-uid$='${uid}'></oo-project-messages>
		<oo-message-form data-iam$='${user}' data-extensions$='${strExts}' on-messagesent='${e => this.onMessagesent(e)}'></oo-message-form>
		`
	}

	render() {
		const user = store.uid
		const extensions = {
			project: projectUid.get(this),
			author: user,
			users: [user, projectOfferer.get(this)]
		}
		render(this.html(user, projectUid.get(this), extensions), this)
		if (messageForm.has(this) === false) {
			messageForm.set(this, this.shadowRoot.querySelector('oo-project-messages'))
		}
	}

	onProjectFetched(e: CustomEvent) {
		const {detail} = e
		const maped: OOExtensionMap = detail.mapedExtensions
		if (maped.has('author')) {
			projectOfferer.set(this, maped.get('author'))
			this.render()
		}
	}

	onMessagesent(e: HTMLElementEventMessageSent<form>) {
		const {detail} = e
		const {uid} = detail
		if (messageForm.has(this) !== false) {
			messageForm.get(this).injectMessages([uid])
		}
	}
}
