import {html} from 'lit-html'
import render from '../../lib/render'
import define from '../../lib/define'
import summary from '../oo-project-summary'
import messages from '../oo-project-messages'
import store from '../../lib/local-storage'

define('oo-project-summary', summary)
define('oo-project-messages', messages)

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

	html(user: string, uid: string) {
		return html`
		<style>
			oo-project-summary {
				margin-bottom: 2rem;
				border-bottom: 0.5px solid #ccc;
			}
		</style>
		<oo-project-summary data-uid$='${uid}'></oo-project-summary>
		<oo-project-messages data-iam$='${user ? user : ''}' data-uid$='${uid}'></oo-project-messages>
		`
	}

	render() {
		const user = store.uid
		render(this.html(user, projectUid.get(this)), this)
	}
}
