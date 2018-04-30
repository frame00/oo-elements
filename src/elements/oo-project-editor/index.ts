import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import patchProject from '../../lib/oo-api-patch-project'
import askForm from '../oo-ask-form'
import define from '../../lib/define'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import { HTMLElementEventChangeAsk } from '../../type/event'
import { attach, dispatch } from '../../lib/notification'
import customEvent from '../../lib/custom-event'

const ATTR = {
	DATA_UID: 'data-uid'
}
const EVENT = {
	UPDATED: customEvent('updated')
}

define('oo-ask-form', askForm)

const projectUid = weakMap<string>()
const stateProgress = weakMap<boolean>()
const stateSuccess = weakMap<boolean>()
const stateProject = weakMap<{
	title?: string
	body?: string
	tags?: string[]
}>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	get project() {
		return stateProject.get(this)
	}

	get progress() {
		return stateProgress.get(this)
	}

	attributeChangedCallback(_, prev, next) {
		if (prev === next || !next) {
			return
		}
		projectUid.set(this, next)
		this.fetchProject(projectUid.get(this))
			.then()
			.catch()
	}

	connectedCallback() {
		super.connectedCallback(false)
		attach()
	}

	render() {
		const { title, body, tags } = this.project
		const { progress, success } = {
			progress: stateProgress.get(this),
			success: stateSuccess.get(this)
		}
		return html`
		<style>
			@import '../../style/_mixin-button.css';
			:host {
				display: block;
			}
			main {
				display: flex;
				flex-direction: column;
			}
			oo-ask-form {
				margin-bottom: 1rem;
			}
			button {
				@mixin button;
				align-self: flex-end;
			}
		</style>
		<main>
			<oo-ask-form data-title$='${title}' data-tags$='${tags.join(
			' '
		)}' on-changed='${e => this.onChanged(e)}'>${body}</oo-ask-form>
			<button class$='${
				progress ? 'progress' : success ? 'resolved' : ''
			}' on-click='${async () =>
			this.patchProject()
				.then()
				.catch()}'>Save</button>
		</main>
		`
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const { response } = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			stateProject.set(this, {
				title: mapedExtensions.get('title'),
				body: mapedExtensions.get('body'),
				tags: mapedExtensions.get('tags') || []
			})
		}
		this.update()
	}

	async patchProject() {
		stateProgress.set(this, true)
		this.update()

		const options = {
			...{
				uid: projectUid.get(this)
			},
			...(this.project || {})
		}

		const api = await patchProject(options)
		const { response } = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			stateProject.set(this, {
				title: mapedExtensions.get('title'),
				body: mapedExtensions.get('body'),
				tags: mapedExtensions.get('tags') || []
			})
			stateSuccess.set(this, true)
			this.dispatchEvent(EVENT.UPDATED)
		} else {
			dispatch({
				message: `Update failed/${response.message}`,
				type: 'error'
			})
		}
		stateProgress.delete(this)
		this.update()
	}

	onChanged(e: HTMLElementEventChangeAsk<HTMLElement>) {
		const { detail } = e
		const { title, message: body, tags } = detail
		const old = this.project || {}
		stateProject.set(this, { ...old, ...{ title, body, tags } })
	}
}
