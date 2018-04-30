import { OOElement } from '../oo-element'
import { repeat } from 'lit-html/lib/repeat'
import { html } from '../../lib/html'
import define from '../../lib/define'
import { OOProject } from '../../type/oo-project'
import getPublicProjects from '../../lib/oo-api-get-public-projects'
import getUserProjects from '../../lib/oo-api-get-user-projects'
import weakMap from '../../lib/weak-map'
import button from '../_atoms/oo-atoms-button'
import projectCard from '../oo-project-card'
import empty from '../oo-empty'

define('oo-atoms-button', button)
define('oo-empty', empty)
define('oo-project-card', projectCard)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_TAG: 'data-tag'
}

const stateIam = weakMap<string>()
const stateTag = weakMap<string>()
const stateProjects = weakMap<OOProject[]>()
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
		const more =
			count > projects.length
				? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${() =>
				this.fetchProjects(iam, tag, paging)}'>More</oo-atoms-button>
		</div>
		`
				: html``

		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<main>
			${repeat(projects, project => {
				const { uid } = project
				return html`
				<oo-project-card data-uid$='${uid}'></oo-project-card>
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
		const { response, headers } = api
		stateItemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const current = this.projects
			stateProjects.set(this, [...current, ...response])
		}
		this.update()
	}
}
