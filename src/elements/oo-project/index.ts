import {html} from 'lit-html'
import render from '../../lib/render'
import summary from '../oo-project-summary'
import define from '../../lib/define'

define('oo-project-summary', summary)

const ATTR = {
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
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
		<style>
			oo-project-summary {
				border-bottom: 0.5px solid #ccc;
			}
		</style>
		<oo-project-summary data-uid$='${uid}'></oo-project-summary>
		`
	}

	render() {
		render(this.html(projectUid.get(this)), this)
	}
}
