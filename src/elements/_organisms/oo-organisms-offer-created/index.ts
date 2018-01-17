import {html} from 'lit-html'
import render from '../../../lib/render'

const ATTR = {
	DATA_PROJECT_UID: 'data-project-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROJECT_UID]
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
			:host {
				display: block;
			}
		</style>
		<div>
		</div>
		`
	}

	render() {
		render(this.html(projectUid.get(this)), this)
	}
}
