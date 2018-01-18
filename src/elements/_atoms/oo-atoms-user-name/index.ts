import {html} from 'lit-html'
import render from '../../../lib/render'
import getUser from '../../../lib/oo-api-get-user'
import toMap from '../../../lib/extensions-to-map'

const ATTR = {
	DATA_IAM: 'data-iam'
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const photo: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.fetchUserData()
	}

	html(uid: string) {
		return html`
		<style>
		</style>
		`
	}

	render() {
		render(this.html(iam.get(this)), this)
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (Array.isArray(res.response)) {
			const ext = toMap(res.response)
			name.set(this, ext.get('name'))
			photo.set(this, ext.get('photo'))
		} else {
			name.delete(this)
			photo.delete(this)
		}
		this.render()
	}
}
