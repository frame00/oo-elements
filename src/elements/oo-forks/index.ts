import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../lib/html'
import define from '../../lib/define'
import {OOProject} from '../../type/oo-project'
import getProjectForks from '../../lib/oo-api-get-projects-forks'
import weakMap from '../../lib/weak-map'
import button from '../_atoms/oo-atoms-button'
import messages from '../oo-project-messages'
const {location} = window

define('oo-atoms-button', button)
define('oo-project-messages', messages)

const ATTR = {
	DATA_UID: 'data-uid'
}

const stateUid = weakMap<string>()
const stateItemCount = weakMap<number>()
const stateProjects = weakMap<Array<OOProject>>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	get uid() {
		return stateUid.get(this)
	}

	get projects() {
		return stateProjects.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateUid.set(this, next)
		stateProjects.set(this, [])
		this.fetchProjects(this.uid)
	}

	html(iam: string, projects: Array<OOProject>, count: number) {
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
			article {
				margin-bottom: 1rem;
				padding-bottom: 1rem;
			}
			a {
				color: inherit;
			}
		</style>
		<main>
			${repeat(projects, project => {
				const {uid} = project
				return html`
				<article>
					<a href$='/project/${uid}'>
						<oo-project-messages data-uid$='${uid}' data-limit=2></oo-project-messages>
					</a>
				</article>
				`
			})}
			${more}
		</main>
		`
	}

	render() {
		render(this.html(this.uid, this.projects, stateItemCount.get(this)), this)
	}

	async fetchProjects(uid: string, time?: number) {
		const api = await getProjectForks(uid, time)
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
