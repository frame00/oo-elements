import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import summary from '../oo-project-summary'
import messages from '../oo-project-messages'
import form from '../oo-message-form'
import {OOProject} from '../../d/oo-project'
import getUserProjects from '../../lib/oo-api-get-user-projects'
import weakMap from '../../lib/weak-map'

define('oo-project-summary', summary)
define('oo-project-messages', messages)
define('oo-message-form', form)

const ATTR = {
	DATA_IAM: 'data-iam'
}

const stateIam = weakMap<string>()
const stateProjects = weakMap<Array<OOProject>>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		stateIam.set(this, next)
		stateProjects.set(this, [])
		this.fetchProjects(stateIam.get(this))
	}

	html(projects: Array<OOProject>) {
		console.log(projects)
		return html`
		<style>
		</style>
		`
	}

	render() {
		render(this.html(stateProjects.get(this)), this)
	}

	async fetchProjects(iam: string, time?: number) {
		const api = await getUserProjects(iam, time)
		const {response} = api
		if (Array.isArray(response)) {
			const current = stateProjects.get(this)
			const fetched = response.reverse()
			stateProjects.set(this, [...current, ...fetched])
		}
		this.render()
	}
}
