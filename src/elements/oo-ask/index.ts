import {html} from 'lit-html'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'
import {ExtensionPricePerHour} from '../../d/extension-price-per-hour'
import getPricePerHour from '../../lib/get-price-per-hour'
import selectHour from '../_atoms/oo-atoms-select-hour'
import define from '../../lib/define'

define('oo-atoms-select-hour', selectHour)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	USER_UPDATED: new Event('userupdated'),
	CHANGED: detail => new CustomEvent('changed', {detail})
}

const iam: WeakMap<object, string> = new WeakMap()
const pricePerHour: WeakMap<object, ExtensionPricePerHour> = new WeakMap()
const hour: WeakMap<object, number> = new WeakMap()
const message: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		hour.set(this, 1)
	}

	get amount() {
		const {price} = getPricePerHour(pricePerHour.get(this))
		const h = hour.get(this)
		if (price === undefined) {
			return 0
		}
		return (price * h).toFixed(2)
	}

	get message() {
		return message.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.fetchUserData()
	}

	connectedCallback() {
		this.fetchUserData()
	}

	html(a: string | number, p: ExtensionPricePerHour, h: number) {
		const {currency, sign} = getPricePerHour(p)
		return html`
		<style>
			:host {
				display: block;
			}
			.amount {
				text-transform: uppercase;
			}
		</style>
		<p class=amount>${currency} ${sign}${a}</p>
		<oo-atoms-select-hour on-changehour='${e => this.onHourChange(e)}'></oo-atoms-select-hour>
		<form on-change='${e => this.onMessageChange(e)}' on-submit='${e => this.onMessageChange(e)}'>
			<textarea name=message></textarea>
		</form>
		`
	}

	render() {
		render(this.html(this.amount, pricePerHour.get(this), hour.get(this)), this)
	}

	onHourChange(e: CustomEvent) {
		const {detail} = e
		hour.set(this, detail)
		this.render()
	}

	onMessageChange(e: HTMLElementEvent<HTMLFormElement>) {
		e.preventDefault()
		const {target} = e
		const {value} = target
		message.set(this, value)
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

	dispatchChanged() {
		const detail = {
			amount: this.amount,
			message: this.message
		}
	}
}
