import { OOElement } from '../oo-element'
import { repeat } from 'lit-html/lib/repeat'
import { html } from '../../lib/html'
import define from '../../lib/define'
import { OOProject } from '../../type/oo-project'
import getProjectForks from '../../lib/oo-api-get-projects-forks'
import weakMap from '../../lib/weak-map'
import button from '../_atoms/oo-atoms-button'
import messages from '../oo-project-messages'
import { href } from '../../lib/href'
const { location } = window

define('oo-atoms-button', button)
define('oo-project-messages', messages)

const ATTR = {
	DATA_UID: 'data-uid'
}

const stateUid = weakMap<string>()
const stateItemCount = weakMap<number>()
const stateProjects = weakMap<OOProject[]>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	get uid() {
		return stateUid.get(this)
	}

	get projects() {
		return stateProjects.get(this)
	}

	attributeChangedCallback([, prev, next]) {
		if (prev === next || !next) {
			return
		}
		stateUid.set(this, next)
		stateProjects.set(this, [])
		this.fetchProjects(this.uid)
			.then()
			.catch()
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const { iam, projects, count } = {
			iam: this.uid,
			projects: this.projects,
			count: stateItemCount.get(this)
		}
		const paging = projects[projects.length - 1].created - 1
		const more =
			count > projects.length
				? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${async () =>
				this.fetchProjects(iam, paging)
					.then()
					.catch()}'>More</oo-atoms-button>
		</div>
		`
				: html``

		return html`
		<style>
			:host {
				display: block;
			}
			:root {
				--link: #2196F3;
			}
			article {
				margin-bottom: 1rem;
				padding-bottom: 1rem;
			}
			a {
				color: var(--link);
				margin-bottom: 1rem;
				display: inline-block;
				font-size: 0.8rem;
			}
		</style>
		<main>
			${repeat(projects, project => {
				const { uid } = project
				return html`
				<article>
					<a href$='${href(`/project/${uid}`)}'>Fork #${uid}</a>
					<oo-project-messages data-uid$='${uid}' data-limit=2></oo-project-messages>
				</article>
				`
			})}
			${more}
		</main>
		`
	}

	async fetchProjects(uid: string, time?: number) {
		const api = await getProjectForks(uid, time)
		const { response, headers } = api
		stateItemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const current = this.projects
			stateProjects.set(this, [...current, ...response])
		}
		this.update()
	}

	moveToDetail(uid: string) {
		location.href = `/project/${uid}`
	}
}
