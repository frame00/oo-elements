import {html} from 'lit-html'
import render from '../../lib/render'
import getProject from '../../lib/oo-api-get-project'

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		this.fetchProject(projectUid.get(this))
	}

	html() {
		return html`
		`
	}

	render() {
		render(this.html(), this)
	}

	async fetchProject(uid: string) {
		const res = await getProject(uid)
		console.log(res)
	}
}
