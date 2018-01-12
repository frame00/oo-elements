import {html} from 'lit-html'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'

const ATTR = {
	DATA_IAM: 'data-iam'
}

const iam: WeakMap<object, string> = new WeakMap()
const name: WeakMap<object, string> = new WeakMap()
const photo: WeakMap<object, string> = new WeakMap()
const skill: WeakMap<object, string> = new WeakMap()
const unitPrice: WeakMap<object, number> = new WeakMap()

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
		this.render()
	}

	async connectedCallback() {
		const res = await getUser(iam.get(this))
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const ext = toMap(res.response)
			name.set(this, ext.get('name'))
			photo.set(this, ext.get('photo'))
			skill.set(this, ext.get('skill'))
			unitPrice.set(this, ext.get('unitPrice'))
		}
	}

	html(uid: string) {
		return html`
		<style>
			:host {
				display: block;
			}
		</style>
		<div></div>
		`
	}

	render() {
		render(this.html(iam.get(this)), this)
	}
}
