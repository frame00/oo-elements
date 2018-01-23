import {html} from 'lit-html'
import render from '../../../lib/render'
import weakMap from '../../../lib/weak-map'
import {Currency} from '../../../d/currency'

interface Options {
	iam: string,
	dest: string,
	amount: string,
	currency: Currency,
	paymentUid?: string
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_DEST: 'data-dest',
	DATA_AMOUNT: 'data-amount',
	DATA_CURRENCY: 'data-currency',
	DATA_PAYMENT_UID: 'data-payment-uid'
}

const stateIam = weakMap<string>()
const stateDest = weakMap<string>()
const stateAmount = weakMap<string>()
const stateCurrency = weakMap<Currency>()
const statePaymentUid = weakMap<string>()

const asCurrency = (data: string): Currency => {
	if (data === 'usd' || data === 'jpy') {
		return data
	}
	return 'usd'
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_DEST, ATTR.DATA_AMOUNT, ATTR.DATA_CURRENCY, ATTR.DATA_PAYMENT_UID]
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next && !next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				stateIam.set(this, next)
				break
			case ATTR.DATA_DEST:
				stateDest.set(this, next)
				break
			case ATTR.DATA_AMOUNT:
				stateAmount.set(this, next)
				break
			case ATTR.DATA_CURRENCY:
				stateCurrency.set(this, asCurrency(next))
				break
			case ATTR.DATA_PAYMENT_UID:
				statePaymentUid.set(this, next)
				break
			default:
				break
		}
		this.render()
	}

	html(opts: Options) {
		return html`
		<style>
		</style>
		`
	}

	render() {
		const opts = {
			iam: stateIam.get(this),
			dest: stateDest.get(this),
			amount: stateAmount.get(this),
			currency: stateCurrency.get(this),
			paymentUid: statePaymentUid.get(this)
		}
		render(this.html(opts), this)
	}
}
