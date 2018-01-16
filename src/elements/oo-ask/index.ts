import {html} from 'lit-html'
import render from '../../lib/render'
import getUser from '../../lib/oo-api-get-user'
import isSuccess from '../../lib/is-api-success'
import toMap from '../../lib/extensions-to-map'
import getPricePerHour from '../../lib/get-price-per-hour'
import selectHour from '../_atoms/oo-atoms-select-hour'
import define from '../../lib/define'
import {Hour} from '../../d/hour'
import {LocaledCurrency} from '../../d/currency'

define('oo-atoms-select-hour', selectHour)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T,
	currentTarget: T
}

const ATTR = {
	DATA_IAM: 'data-iam'
}
const EVENT = {
	USER_UPDATED: new Event('userupdated'),
	CHANGED: detail => new CustomEvent('changed', {detail})
}

const iam: WeakMap<object, string> = new WeakMap()
const pricing: WeakMap<object, LocaledCurrency> = new WeakMap()
const hour: WeakMap<object, Hour> = new WeakMap()
const message: WeakMap<object, string> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM]
	}

	constructor() {
		super()
		iam.set(this, this.getAttribute(ATTR.DATA_IAM))
		hour.set(this, 1)
		message.set(this, '')
	}

	get amount(): string {
		const prc = pricing.get(this)
		if (prc === undefined) {
			return undefined
		}
		const h = hour.get(this)
		if (h === 'pend') {
			return h
		}
		const {price} = prc
		return (price * h).toFixed(2)
	}

	get message() {
		return message.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		iam.set(this, next)
		this.fetchUserData()
	}

	html(a: string, p: LocaledCurrency) {
		if (a === undefined) {
			return html``
		}
		const {currency, sign} = p
		const amountTag = () => {
			if (a === 'pend') {
				return html`<p class=amount>Pend</p>`
			}
			return html`<p class=amount>${currency} ${sign}${a}</p>`
		}
		return html`
		<style>
			:host {
				display: block;
			}
			.amount {
				text-transform: uppercase;
			}
		</style>
		${amountTag()}
		<oo-atoms-select-hour on-changehour='${e => this.onHourChange(e)}'></oo-atoms-select-hour>
		<form on-change='${e => this.onMessageChange(e)}' on-submit='${e => this.onMessageChange(e)}'>
			<textarea name=message></textarea>
		</form>
		`
	}

	render() {
		render(this.html(this.amount, pricing.get(this)), this)
	}

	onHourChange(e: CustomEvent) {
		const {detail} = e
		hour.set(this, detail)
		this.render()
		this.dispatchChanged()
	}

	onMessageChange(e: HTMLElementEvent<HTMLFormElement>) {
		const {target} = e
		const {value} = target
		if (value) {
			message.set(this, value)
			this.dispatchChanged()
		}
	}

	async fetchUserData() {
		const res = await getUser(iam.get(this))
		if (isSuccess(res.status) && Array.isArray(res.response)) {
			const ext = toMap(res.response)
			const localed = getPricePerHour(ext.get('price_per_hour'))
			pricing.set(this, localed)
			message.set(this, '')
			this.render()
		} else {
			pricing.delete(this)
			message.delete(this)
			this.render()
		}
		this.dispatchEvent(EVENT.USER_UPDATED)
	}

	dispatchChanged() {
		const {currency} = pricing.get(this)
		const detail = {
			amount: this.amount,
			currency,
			message: this.message
		}
		this.dispatchEvent(EVENT.CHANGED(detail))
	}
}
