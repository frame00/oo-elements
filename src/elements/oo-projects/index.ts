import {OOElement} from '../oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {html} from '../../lib/html'
import define from '../../lib/define'
import projectStatus from '../oo-project-status'
import {OOProject} from '../../type/oo-project'
import getPublicProjects from '../../lib/oo-api-get-public-projects'
import getUserProjects from '../../lib/oo-api-get-user-projects'
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
	DATA_IAM: 'data-iam',
	DATA_TAG: 'data-tag'
}

const stateIam = weakMap<string>()
const stateTag = weakMap<string>()
const stateProjects = weakMap<Array<OOProject>>()
const stateItemCount = weakMap<number>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_TAG]
	}

	get iam() {
		return stateIam.get(this)
	}

	get tag() {
		return stateTag.get(this)
	}

	get projects() {
		return stateProjects.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_IAM:
				stateIam.set(this, next)
				break
			case ATTR.DATA_TAG:
				stateTag.set(this, next)
				break
			default:
				break
		}
		if (this.connected) {
			this.initialFetchProjects()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
		this.initialFetchProjects()
	}

	render() {
		const iam = this.iam
		const tag = this.tag
		const projects = this.projects
		const count = stateItemCount.get(this)
		if (projects.length === 0) {
			return html`
			<oo-empty data-type=will-be-find></oo-empty>
			`
		}
		const paging = projects[projects.length - 1].created - 1
		const more = count > projects.length ? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${() => this.fetchProjects(iam, tag, paging)}'>More</oo-atoms-button>
		</div>
		` : html``

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
			${repeat(projects, project => {
				const {uid} = project
				const exts = toMap(project)
				const title = exts.has('title') ? exts.get('title') : ''
				const body = exts.has('body') ? exts.get('body') : ''
				const offerer = exts.has('author') ? exts.get('author') : ''
				const assignee = exts.has('assignee') ? exts.get('assignee') : ''
				const tags = exts.has('tags') ? exts.get('tags') : []
				const titleHTML = title ? html`<h1>${title}</h1>` : html``
				return html`
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
				`
			})}
			${more}
		</main>
		`
	}

	async initialFetchProjects() {
		stateProjects.set(this, [])
		this.fetchProjects(this.iam, this.tag)
	}

	async fetchProjects(iam: string | null, tag?: string | null, time?: number) {
		const api = await (() => {
			if (typeof iam === 'string' && iam !== '') {
				return getUserProjects(iam, time)
			}
			return getPublicProjects(tag, time)
		})()
		const {response, headers} = api
		stateItemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const current = this.projects
			stateProjects.set(this, [...current, ...response])
		}
		this.update()
	}
}
