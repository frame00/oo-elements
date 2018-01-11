import {html} from 'lit-html'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'

const ATTR = {
	DATA_IAM: 'data-iam'
}

export default class extends HTMLElement {
	state: {
		iam: string,
		name?: string,
		photo?: string,
		skill?: string,
		unitPrice?: number
	}

	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		const iam = this.getAttribute(ATTR.DATA_IAM)
		this.state = {iam}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		this.state.iam = next
		this.render()
	}

	async connectedCallback() {
		const res = await getUser(this.state.iam)
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const ext = toMap(res.response)
			const name = ext.get('name')
			const photo = ext.get('photo')
			const skill = ext.get('skill')
			const unitPrice = ext.get('unit_price')
			const newState = {name, photo, skill, unitPrice}
			this.state = {...this.state, ...newState}
			console.log(this.state)
		}
	}

	html(iam) {
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
		render(this.html(this.state.iam), this)
	}
}
