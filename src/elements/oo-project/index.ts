import {html, render} from '../../lib/html'
import define from '../../lib/define'
import summary from '../oo-project-summary'
import messages from '../oo-project-messages'
import empty from '../oo-empty'
import form from '../oo-message-form'
import store from '../../lib/local-storage'
import {OOExtensionsLikeObject} from '../../type/oo-extension'
import {HTMLElementEventMessageSent} from '../../type/event'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'

define('oo-project-summary', summary)
define('oo-project-messages', messages)
define('oo-message-form', form)
define('oo-empty', empty)

interface Options {
	found: boolean,
	user: string,
	uid: string,
	accepted: boolean,
	extensions: OOExtensionsLikeObject
}

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid = weakMap<string>()
const projectOfferer = weakMap<string>()
const messageForm = weakMap<messages>()
const projectAccepted = weakMap<boolean>()
const projectFound = weakMap<boolean>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		projectUid.set(this, next)
		this.fetchProject(projectUid.get(this))
	}

	html(opts: Options) {
		const {found, extensions, uid, user, accepted} = opts
		if (found === false) {
			return html`
			<oo-empty></oo-empty>
			`
		}
		const strExts = JSON.stringify(extensions)
		return html`
		<style>
			oo-project-summary {
				margin-bottom: 2rem;
				border-bottom: 0.5px solid #ccc;
			}
		</style>
		<oo-project-summary data-uid$='${uid}'></oo-project-summary>
		<oo-project-messages data-iam$='${user ? user : ''}' data-uid$='${uid}'></oo-project-messages>
		${(() => {
			if (accepted === true) {
				return html`
				<oo-message-form data-iam$='${user}' data-extensions$='${strExts}' on-messagesent='${e => this.onMessagesent(e)}'></oo-message-form>
				`
			}
		})()}
		`
	}

	render() {
		const user = store.uid
		const extensions = {
			project: projectUid.get(this),
			author: user,
			users: [user, projectOfferer.get(this)]
		}
		const options = {
			found: projectFound.get(this),
			user: store.uid,
			uid: projectUid.get(this),
			accepted: projectAccepted.get(this),
			extensions
		}
		render(this.html(options), this)
		if (messageForm.has(this) === false) {
			messageForm.set(this, this.shadowRoot.querySelector('oo-project-messages'))
		}
	}

	onMessagesent(e: HTMLElementEventMessageSent<form>) {
		const {detail} = e
		const {uid} = detail
		if (messageForm.has(this) !== false) {
			messageForm.get(this).injectMessages([uid])
		}
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectFound.set(this, true)
			projectOfferer.set(this, mapedExtensions.get('author'))
			projectAccepted.set(this, mapedExtensions.get('offer_permission'))
		} else {
			projectFound.set(this, false)
			projectOfferer.delete(this)
			projectAccepted.delete(this)
		}
		this.render()
	}
}
