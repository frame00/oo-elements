import {OOElement} from '../oo-element'
import {html, render} from '../../lib/html'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import define from '../../lib/define'
import markdown from '../oo-markdown'
import projectEditor from '../oo-project-editor'
import message from '../_atoms/oo-atoms-message'
import users from '../_molecules/oo-molecules-project-users'
import datetime from '../_atoms/oo-atoms-datetime'
import modal from '../oo-modal'
import projectStatus from '../oo-project-status'
import weakMap from '../../lib/weak-map'
import store from '../../lib/local-storage'
import {template as tagsTemplate} from '../../lib/tags'

define('oo-markdown', markdown)
define('oo-atoms-message', message)
define('oo-molecules-project-users', users)
define('oo-atoms-datetime', datetime)
define('oo-project-status', projectStatus)
define('oo-project-editor', projectEditor)
define('oo-modal', modal)

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid = weakMap<string>()
const projectTitle = weakMap<string>()
const projectBody = weakMap<string>()
const projectTags = weakMap<Array<string>>()
const projectAuthor = weakMap<string>()
const projectAssignee = weakMap<string>()
const projectCreated = weakMap<number>()
const stateProjectUpdated = weakMap<boolean>()
const stateOpenEditor = weakMap<boolean>()

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
		const uid = projectUid.get(this)
		const created = projectCreated.get(this)
		const title = projectTitle.get(this)
		const body = projectBody.get(this)
		const tags = projectTags.get(this)
		const author = projectAuthor.get(this)
		const assignee = projectAssignee.get(this)
		const editor = stateOpenEditor.get(this)
		const projectUpdated = stateProjectUpdated.get(this)
		const isPostOwner = store.uid === author

		const reloadButton = (show: boolean) => {
			// This is a plan to delete. No need for testing.
			if (show) {
				return html`<button on-click='${() => this.fetchProject(uid)}'>Reload</button>`
			}
			return html``
		}
		const editButton = (show: boolean) => {
			if (show) {
				return html`<button on-click='${() => this.openEditor()}'>Edit</button>`
			}
			return html``
		}
		const modalBody = (show: boolean) => {
			if (show) {
				return html`<oo-project-editor slot=body data-uid$='${uid}' on-updated='${() => this.onProjectUpdated()}'></oo-project-editor>`
			}
			return html``
		}
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-heading.css';
			@import '../../style/_reset-button.css';
			@import '../../style/_mixin-tags.css';
			:host {
				display: block;
			}
			section {
				padding: 1.5rem;
				p {
					margin: 0;
					&:not(:last-child) {
						margin-bottom: 1rem;
					}
				}
			}
			h1 {
				font-family: var(--font-family);
			}
			h2 {
				@mixin heading;
				font-family: var(--font-family);
			}
			oo-project-status {
				margin-bottom: 0.5rem;
			}
			oo-molecules-project-users {
				margin-bottom: 1rem;
			}
			oo-project-editor {
				padding: 1rem;
			}
			oo-modal {
				[slot=header] {
					background: whitesmoke;
					padding: 2rem;
					h2 {
						margin: 0;
					}
				}
			}
			aside {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
			}
			button {
				padding: 0.2rem 0.6rem;
				border: 1px solid;
				border-radius: 5px;
				font-size: 0.8rem;
				color: #607d8b;
				&:hover {
					background: #607d8b;
					color: white;
				}
				&:not(:first-child) {
					margin-left: 0.5rem;
				}
			}
			.tags {
				@mixin tags;
			}
		</style>
		<main>
			<oo-atoms-message data-tooltip-position=left>
				<section slot=body>
					<aside>
						<oo-project-status data-uid$='${uid}'></oo-project-status>
						<div>
							${reloadButton(projectUpdated)}
							${editButton(isPostOwner)}
						</div>
					</aside>
					${(() => {
						if (title) {
							return html`<h1>${title}</h1>`
						}
						return html``
					})()}
					<oo-markdown>${body}</oo-markdown>
					${tagsTemplate(tags)}
				</section>
				<footer slot=footer>
					<oo-molecules-project-users data-author$='${author}' data-assignee$='${assignee}'></oo-molecules-project-users>
					<oo-atoms-datetime data-unixtime$='${created}'></oo-atoms-datetime>
				</footer>
			</oo-atoms-message>
		</main>
		<oo-modal data-open$='${editor ? 'enabled' : 'disabled'}' on-close='${() => this.closedEditor()}'>
			<div slot=header><h2>Edit post</h2></div>
			${modalBody(editor)}
		</oo-modal>
		`
	}

	progress() {
		const template = html`
		<style>
			@import '../../style/_mixin-button-progress.css';
			main {
				padding: 1rem;
			}
			div {
				height: 2rem;
				border-radius: 5px;
				margin-bottom: 1rem;
				@mixin progress;
			}
			.header {
				width: 100%;
			}
			.content {
				width: 80%;
			}
		</style>
		<oo-atoms-message>
			<main slot=body>
				<div class=header></div>
				<div class=content></div>
				<div class=content></div>
			<main>
		</oo-atoms-message>
		`
		render(template, this)
	}

	openEditor() {
		stateOpenEditor.set(this, true)
		this.update()
	}

	closedEditor() {
		stateOpenEditor.delete(this)
		this.update()
	}

	onProjectUpdated() {
		this.closedEditor()
		stateProjectUpdated.set(this, true)
		this.update()
	}

	async fetchProject(uid: string) {
		this.progress()
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			projectCreated.set(this, item.created)
			projectTitle.set(this, mapedExtensions.get('title'))
			projectBody.set(this, mapedExtensions.get('body'))
			projectTags.set(this, mapedExtensions.get('tags') || [])
			projectAuthor.set(this, mapedExtensions.get('author'))
			projectAssignee.set(this, mapedExtensions.get('assignee'))
			stateProjectUpdated.delete(this)
		} else {
			projectBody.delete(this)
			projectAuthor.delete(this)
		}
		this.update()
	}
}
