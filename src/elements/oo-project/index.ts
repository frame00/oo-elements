import {html, render} from '../../lib/html'
import define from '../../lib/define'
import summary from '../oo-project-summary'
import messages from '../oo-project-messages'
import button from '../_atoms/oo-atoms-button'
import empty from '../oo-empty'
import form from '../oo-message-form'
import store from '../../lib/local-storage'
import {OOExtensionsLikeObject} from '../../type/oo-extension'
import {HTMLElementEventMessageSent} from '../../type/event'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import {Scope} from '../../type/scope'
import createProjectForks from '../../lib/oo-api-create-project-forks'
import {ProjectCreatedDetail, ProjectCreated} from '../../type/event'

define('oo-project-summary', summary)
define('oo-project-messages', messages)
define('oo-message-form', form)
define('oo-empty', empty)
define('oo-atoms-button', button)

interface Options {
	found: boolean,
	user: string,
	uid: string,
	accepted: boolean,
	scope: Scope,
	assignee: string,
	extensions: OOExtensionsLikeObject
}

const ATTR = {
	DATA_UID: 'data-uid'
}
const EVENT = {
	PROJECT_CREATED: (detail: ProjectCreatedDetail): ProjectCreated => new CustomEvent('projectcreated', {detail}),
	PROJECT_CREATION_FAILED: detail => new CustomEvent('projectcreationfailed', {detail})
}

const projectUid = weakMap<string>()
const projectOfferer = weakMap<string>()
const projectAccepted = weakMap<boolean>()
const projectFound = weakMap<boolean>()
const projectScope = weakMap<Scope>()
const projectAssignee = weakMap<string>()
const messageForm = weakMap<messages>()

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
		const {found, extensions, uid, user, scope, accepted, assignee} = opts
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
			if (user && assignee && (scope === 'public' || accepted === true)) {
				return html`
				<oo-message-form data-iam$='${user}' data-extensions$='${strExts}' on-messagesent='${e => this.onMessagesent(e)}'></oo-message-form>
				`
			}
		})()}
		${(() => {
			if (user && !assignee) {
				return html`
				<oo-atoms-button class=fork on-clicked='${() => this.createFork()}'>Answer with fork</oo-atoms-button>
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
			scope: projectScope.get(this),
			assignee: projectAssignee.get(this),
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
			projectAccepted.set(this, mapedExtensions.get('approve'))
			projectScope.set(this, mapedExtensions.get('scope'))
			projectAssignee.set(this, mapedExtensions.get('assignee'))
		} else {
			projectFound.set(this, false)
			projectOfferer.delete(this)
			projectAccepted.delete(this)
		}
		this.render()
	}

	async createFork() {
		const uid = projectUid.get(this)
		const project = await createProjectForks(uid)
		const {response} = project
		if (Array.isArray(response)) {
			this.dispatchEvent(EVENT.PROJECT_CREATED(project))
		} else {
			this.dispatchEvent(EVENT.PROJECT_CREATION_FAILED(project))
		}
	}
}
