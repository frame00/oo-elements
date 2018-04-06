import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import define from '../../lib/define'
import projectStatus from '../oo-project-status'
import {OOProject} from '../../type/oo-project'
import getProject from '../../lib/oo-api-get-project'
import weakMap from '../../lib/weak-map'
import markdown from '../oo-markdown'
import message from '../_atoms/oo-atoms-message'
import button from '../_atoms/oo-atoms-button'
import users from '../_molecules/oo-molecules-project-users'
import empty from '../oo-empty'
import toMap from '../../lib/extensions-to-map'
import {template as tagsTemplate} from '../../lib/tags'
import {href} from '../../lib/href'

define('oo-markdown', markdown)
define('oo-atoms-message', message)
define('oo-atoms-button', button)
define('oo-molecules-project-users', users)
define('oo-empty', empty)
define('oo-project-status', projectStatus)

const ATTR = {
	DATA_UID: 'data-uid'
}

const stateUid = weakMap<string>()
const stateProject = weakMap<OOProject>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		stateUid.set(this, next)
		stateProject.delete(this)
		this.fetchProjects(stateUid.get(this))
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		stateUid.delete(this)
		stateProject.delete(this)
	}

	render() {
		const project = stateProject.get(this)
		if (!project || !('uid' in project)) {
			return html`
			<oo-empty></oo-empty>
			`
		}

		const {uid} = project
		const exts = toMap(project)
		const title = exts.has('title') ? exts.get('title') : ''
		const body = exts.has('body') ? exts.get('body') : ''
		const offerer = exts.has('author') ? exts.get('author') : ''
		const assignee = exts.has('assignee') ? exts.get('assignee') : ''
		const tags = exts.has('tags') ? exts.get('tags') : []
		const titleHTML = title ? html`<h1>${title}</h1>` : html``

		return html`
		<style>
			@import '../../style/_mixin-tags.css';
			@import '../../style/_vars-color-yellow.css';
			:host {
				display: block;
			}
			:root {
				--detail-btn: #3F51B5;
			}
			main {
				> a {
					display: block;
					margin-bottom: 5rem;
				}
			}
			oo-atoms-message {
				&:not(:last-child) {
					margin-bottom: 3rem;
				}
			}
			oo-project-status {
				margin-bottom: 0.5rem;
			}
			a {
				color: inherit;
			}
			section {
				padding: 1rem;
				display: flex;
				flex-direction: column;
				background: var(--yellow);
				.body {
					max-height: 200px;
					overflow: hidden;
				}
				oo-atoms-button {
					align-self: flex-end;
				}
			}
			aside {
				display: none;
				margin: -1rem;
				margin-top: 1rem;
				padding: 1rem;
				background: #00000020;
				align-items: baseline;
				justify-content: space-between;
				&.shown {
					display: flex;
				}
			}
			.tags {
				@mixin tags;
				margin-top: 0;
			}
		</style>
		<main>
			<a href$='${href(`/project/${uid}`)}'>
				<oo-atoms-message>
					<section slot=body>
						<oo-project-status data-uid$='${uid}'></oo-project-status>
						${titleHTML}
						<div class=body>
							<oo-markdown>${body}</oo-markdown>
						</div>
						<aside class$='${tags.length > 0 ? 'shown' : ''}'>
							${tagsTemplate(tags)}
						</aside>
					</section>
					<footer slot=footer>
						<oo-molecules-project-users data-author$='${offerer}' data-assignee$='${assignee}'></oo-molecules-project-users>
					</footer>
				</oo-atoms-message>
			</a>
		</main>
		`
	}

	async fetchProjects(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [project] = response
			stateProject.set(this, project)
		} else {
			stateProject.delete(this)
		}
		this.update()
	}
}
