import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../lib/html'
import define from '../../lib/define'
import projectStatus from '../oo-project-status'
import {OOProject} from '../../type/oo-project'
import getPublicProjects from '../../lib/oo-api-get-public-projects'
import getUserProjects from '../../lib/oo-api-get-user-projects'
import weakMap from '../../lib/weak-map'
import message from '../_atoms/oo-atoms-message'
import button from '../_atoms/oo-atoms-button'
import userName from '../_atoms/oo-atoms-user-name'
import empty from '../oo-empty'
import toMap from '../../lib/extensions-to-map'
const {location} = window

define('oo-atoms-message', message)
define('oo-atoms-button', button)
define('oo-atoms-user-name', userName)
define('oo-empty', empty)
define('oo-project-status', projectStatus)

const ATTR = {
	DATA_IAM: 'data-iam'
}

const stateIam = weakMap<string>()
const stateProjects = weakMap<Array<OOProject>>()
const stateItemCount = weakMap<number>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	get iam() {
		return stateIam.get(this)
	}

	get projects() {
		return stateProjects.get(this)
	}

	connectedCallback() {
		if (this.hasAttribute(ATTR.DATA_IAM) === false) {
			stateProjects.set(this, [])
			this.fetchProjects(this.iam)
		}
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		stateIam.set(this, next)
		stateProjects.set(this, [])
		this.fetchProjects(this.iam)
	}

	html(iam: string, projects: Array<OOProject>, count: number) {
		if (projects.length === 0) {
			return html`
			<oo-empty data-type=will-be-find></oo-empty>
			`
		}
		const paging = projects[projects.length - 1].created - 1
		const more = count > projects.length ? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${() => this.fetchProjects(iam, paging)}'>More</oo-atoms-button>
		</div>
		` : html``

		return html`
		<style>
			:host {
				display: block;
			}
			oo-atoms-message {
				&:not(:last-child) {
					margin-bottom: 3rem;
				}
			}
			oo-project-status {
				margin-bottom: 0.5rem;
			}
			section {
				padding: 1rem;
				display: flex;
				flex-direction: column;
				oo-atoms-button {
					align-self: flex-end;
				}
			}
		</style>
		<main>
			${repeat(projects, project => {
				const {uid} = project
				const exts = toMap(project)
				const body = exts.has('body') ? exts.get('body') : ''
				const offerer =exts.has('author') ? exts.get('author') : ''
				return html`
				<oo-atoms-message>
					<section slot=body>
						<oo-project-status data-uid$='${uid}'></oo-project-status>
						<div class=body>
							${body}
						</div>
						<oo-atoms-button on-clicked='${() => this.moveToDetail(uid)}'>Detail</oo-atoms-button>
					</section>
					<footer slot=footer>
						<oo-atoms-user-name data-iam$='${offerer}' data-size=small></oo-atoms-user-name>
					</footer>
				</oo-atoms-message>
				`
			})}
			${more}
		</main>
		`
	}

	render() {
		render(this.html(this.iam, this.projects, stateItemCount.get(this)), this)
	}

	async fetchProjects(iam: string | null, time?: number) {
		const api = await (() => {
			if (typeof iam === 'string' && iam !== '') {
				return getUserProjects(iam, time)
			}
			return getPublicProjects(time)
		})()
		const {response, headers} = api
		stateItemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const current = this.projects
			stateProjects.set(this, [...current, ...response])
		}
		this.render()
	}

	moveToDetail(uid: string) {
		location.href = `/project/${uid}`
	}
}
