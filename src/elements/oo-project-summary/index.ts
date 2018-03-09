import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import {repeat} from 'lit-html/lib/repeat'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import define from '../../lib/define'
import markdown from '../oo-markdown'
import projectEditor from '../oo-project-editor'
import message from '../_atoms/oo-atoms-message'
import userName from '../_atoms/oo-atoms-user-name'
import datetime from '../_atoms/oo-atoms-datetime'
import modal from '../oo-modal'
import projectStatus from '../oo-project-status'
import weakMap from '../../lib/weak-map'

define('oo-markdown', markdown)
define('oo-atoms-message', message)
define('oo-atoms-user-name', userName)
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
		const editor = stateOpenEditor.get(this)
		const projectUpdated = stateProjectUpdated.get(this)
		const reloadButton = (show: boolean) => {
			// This is a plan to delete. No need for testing.
			if (show) {
				return html`<button on-click='${() => this.fetchProject(uid)}'>Reload</button>`
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
			h2 {
				@mixin heading;
				font-family: var(--font-family);
			}
			dl {
				margin: 0 0 1rem;
				font-family: var(--font-family);
				display: flex;
				flex-wrap: wrap;
				font-size: 0.9rem;
				dt {
					width: 30%;
					margin-bottom: 0.2rem;
					font-weight: 300;
				}
				dd {
					margin: 0;
					width: 70%;
				}
			}
			oo-project-status {
				margin-bottom: 0.5rem;
			}
			h1 {
				font-family: var(--font-family);
			}
			oo-atoms-user-name {
				margin-bottom: 1rem;
			}
			.amount {
				text-transform: uppercase;
			}
			aside {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
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
			.tags {
				span {
					display: inline-block;
					margin: 0 1rem;
				}
			}
		</style>
		<main>
			<oo-atoms-message data-tooltip-position=left>
				<section slot=body>
					<aside>
						<oo-project-status data-uid$='${uid}'></oo-project-status>
						<div>
							${reloadButton(projectUpdated)}
							<button on-click='${() => this.openEditor()}'>Edit</button>
						</div>
					</aside>
					${(() => {
						if (title) {
							return html`<h1>${title}</h1>`
						}
						return html``
					})()}
					<oo-markdown>${body}</oo-markdown>
					<div class=tags>
						${repeat(tags, tag => html`<span>${tag}</span>`)}
					</div>
				</section>
				<footer slot=footer>
					<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
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
			stateProjectUpdated.delete(this)
		} else {
			projectBody.delete(this)
			projectAuthor.delete(this)
		}
		this.update()
	}
}
