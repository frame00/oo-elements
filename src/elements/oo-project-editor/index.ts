import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import patchProject from '../../lib/oo-api-patch-project'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid = weakMap<string>()
const projectTitle = weakMap<string>()
const projectBody = weakMap<string>()
const projectTags = weakMap<Array<string>>()
const stateChangedValues = weakMap<{
	title?: string,
	body?: string,
	tags?: Array<string>
}>()

export default class extends OOElement {
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

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const {title, body, tags} = {
			title: projectTitle.get(this),
			body: projectBody.get(this),
			tags: projectTags.get(this)
		}
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-textarea.css';
			:host {
				display: block;
			}
			textarea,
			input {
				@mixin textarea;
			}
			input {
				height: 3rem;
			}
		</style>
		<main>
			<input name=title type=text value$='${title}' on-change='${e => this.changedValue(e)}'></input>
			<textarea name=body on-change='${e => this.changedValue(e)}'>${body}</textarea>
			<input name=tags type=text value$='${tags.join(' ')}' on-change='${e => this.changedValue(e)}'></input>
			<button on-click='${() => this.patchProject()}'>Save</button>
		</main>
		`
	}

	changedValue(e: HTMLElementEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const {name} = e.target
		const {value} = e.target
		const old = stateChangedValues.get(this) || {}
		switch(name) {
			case 'title':
				stateChangedValues.set(this, {...old, ...{title: value}})
				break
			case 'body':
				stateChangedValues.set(this, {...old, ...{body: value}})
				break
			case 'tags':
				stateChangedValues.set(this, {...old, ...{tags: value.split(/ | /)}})
				break
			default:
				break
		}
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectTitle.set(this, mapedExtensions.get('title'))
			projectBody.set(this, mapedExtensions.get('body'))
			projectTags.set(this, mapedExtensions.get('tags') || [])
		}
		this.update()
	}

	async patchProject() {
		const options = {...{
			uid: projectUid.get(this)
		}, ...stateChangedValues.get(this)}
		const api = await patchProject(options)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectTitle.set(this, mapedExtensions.get('title'))
			projectBody.set(this, mapedExtensions.get('body'))
			projectTags.set(this, mapedExtensions.get('tags'))
		}
		this.update()
	}
}
