import {html} from 'lit-html'
import render from '../../lib/render'
import summary from '../oo-project-summary'
import define from '../../lib/define'

define('oo-project-summary', summary)

const ATTR = {
	DATA_PROJECT_UID: 'data-project-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROJECT_UID]
	}

	constructor() {
		super()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		this.render()
	}

	html(uid: string) {
		return html`
		<oo-project-summary data-project-uid$='${uid}'></oo-project-summary>
		`
	}

	render() {
		render(this.html(projectUid.get(this)), this)
	}
}
