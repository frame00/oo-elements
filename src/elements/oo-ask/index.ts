import {html} from 'lit-html'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	USER_UPDATED: new Event('userupdated')
}

const iam: WeakMap<object, string> = new WeakMap()
const pricePerHour: WeakMap<object, number> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.fetchUserData()
	}

	connectedCallback() {
		this.fetchUserData()
	}

	html(p: number) {
		return html`
		<style>
		</style>
		`
	}

	render() {
		render(this.html(pricePerHour.get(this)), this)
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const ext = toMap(res.response)
			pricePerHour.set(this, ext.get('price_per_hour'))
			this.render()
		} else {
			this.render()
		}
		this.dispatchEvent(EVENT.USER_UPDATED)
	}
}
