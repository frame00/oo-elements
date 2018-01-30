import {html} from 'lit-html'
import render from '../../lib/render'
import weakMap from '../../lib/weak-map'
import {Currency} from '../../d/currency'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import button from '../_atoms/oo-atoms-button'
import define from '../../lib/define'
import {currencyToSign} from '../../lib/get-price-per-hour'
import stripeCheckout from '../../lib/payment-handler-by-stripe'
import getPayment from '../../lib/oo-api-get-payment'
import toMap from '../../lib/extensions-to-map'
import asStripeAmount from './lib/as-stripe-amount'
import stripeCallback from './lib/stripe-callback'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', button)

interface Options {
	iam: string,
	uid: string,
	dest: string,
	amount: string,
	currency: Currency,
	paymentUid?: string,
	paymentPaid?: boolean
	chargeSuccessed?: boolean
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_UID: 'data-uid',
	DATA_DEST: 'data-dest',
	DATA_AMOUNT: 'data-amount',
	DATA_CURRENCY: 'data-currency',
	DATA_PAYMENT_UID: 'data-payment-uid'
}

const stateIam = weakMap<string>()
const stateUid = weakMap<string>()
const stateDest = weakMap<string>()
const stateAmount = weakMap<string>()
const stateCurrency = weakMap<Currency>()
const statePaymentUid = weakMap<string>()
const statePaymentPaid = weakMap<boolean>()
const stateChargeSuccessed = weakMap<boolean>()
const testData = {
	client_ip: 'x',
	created: 1,
	email: 'x',
	id: 'x',
	livemode: true,
	object: 'x',
	type: 'x',
	used: false
}

const isFullFilledRequiredStates = (opts: Options): boolean => {
	const {iam, uid, dest, amount, currency} = opts
	if (iam && uid && dest && amount && currency) {
		return true
	}
	return false
}
const asCurrency = (data: string): Currency => {
	if (data === 'usd' || data === 'jpy') {
		return data
	}
	return 'usd'
}
const validUid = (data: string): boolean => {
	if (typeof data === 'string' && data !== 'undefined' && data !== 'null' && data !== '') {
		return true
	}
	return false
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_IAM, ATTR.DATA_UID, ATTR.DATA_DEST, ATTR.DATA_AMOUNT, ATTR.DATA_CURRENCY, ATTR.DATA_PAYMENT_UID]
	}

	get paid() {
		return statePaymentPaid.get(this)
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next && !next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_IAM:
				stateIam.set(this, next)
				break
			case ATTR.DATA_UID:
				stateUid.set(this, next)
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
				this.fetchPayment()
				break
			default:
				break
		}
		this.render()
	}

	html(opts: Options) {
		if(isFullFilledRequiredStates(opts) === false) {
			return html``
		}
		const {iam, currency, amount, paymentPaid, chargeSuccessed} = opts
		const sign = currencyToSign(currency)
		const done = paymentPaid === true
		const paymentButton = done ? html`` : (() => {
			const state = chargeSuccessed === true ? 'resolved' : chargeSuccessed === false ? 'rejected' : ''
			return html`<oo-atoms-button on-clicked='${() => this.stripeCheckout()}' data-state$='${state}' data-block=enabled>Pay</oo-atoms-button>`
		})()

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				diaplay: block;
			}
			oo-atoms-message {
				font-family: var(--font-family);
			}
			header {
				padding: 1rem;
				text-transform: uppercase;
				font-size: 2rem;
				font-weight: 300;
				border-bottom: 0.5px solid #00000036;
			}
			.pay {
				display: flex;
				align-items: center;
			}
			oo-atoms-button,
			oo-atoms-user-name {
				padding: 1rem;
				width: 50%;
			}
			oo-atoms-user-name {
				display: flex;
				align-items: center;
			}
			article {
				&.wait {
					background: #4caf50;
					color: white;
				}
				&.done {
					background: #cfd8dc;
				}
			}
		</style>
		<oo-atoms-message data-tooltip-position=center>
			<section slot=body>
				<article class$='${done ? 'done' : 'wait'}'>
					<header>${currency} ${sign}${amount}</header>
					<div class=pay>
						${paymentButton}
						<oo-atoms-user-name data-iam$=${iam} data-size=small></oo-atoms-user-name>
					</div>
					<section>
						<slot name=body></slot>
					</section>
				</article>
			</section>
		</oo-atoms-message>
		`
	}

	render() {
		if (this.hasAttribute(ATTR.DATA_PAYMENT_UID) && this.paid === undefined) {
			// Wait for Payment API
			return
		}
		const opts = {
			iam: stateIam.get(this),
			uid: stateUid.get(this),
			dest: stateDest.get(this),
			amount: stateAmount.get(this),
			currency: stateCurrency.get(this),
			paymentUid: statePaymentUid.get(this),
			paymentPaid: this.paid,
			chargeSuccessed: stateChargeSuccessed.get(this)
		}
		render(this.html(opts), this)
	}

	async stripeCheckout(test?: boolean) {
		if (stateChargeSuccessed.get(this) === true) {
			return false
		}
		const options = {
			amount: stateAmount.get(this),
			currency: stateCurrency.get(this),
			iam: stateIam.get(this),
			uid: stateUid.get(this)
		}
		const callback = stripeCallback(this, options, (err, results) => {
			if (err) {
				stateChargeSuccessed.set(this, false)
			} else {
				const {response} = results
				if (Array.isArray(response)) {
					const [data] = response
					statePaymentUid.set(this, data.uid)
					statePaymentPaid.set(this, true)
					stateChargeSuccessed.set(this, true)
				} else {
					stateChargeSuccessed.set(this, false)
				}
			}
			this.render()
		})
		try {
			const handler = await stripeCheckout(callback)
			const amount = asStripeAmount(stateAmount.get(this))
			handler.open({
				name: 'Stripe.com',
				description: '2 widgets',
				amount
			})
		} catch(err) {
			console.error(err)
		}
		if (test === true) {
			callback(testData)
		}
	}

	async fetchPayment() {
		const uid = statePaymentUid.get(this)
		if (validUid(uid) === false) {
			statePaymentPaid.set(this, false)
			this.render()
			return
		}
		try {
			const payment = await getPayment(uid)
			const {response} = payment
			if (Array.isArray(response)) {
				const [pay] = response
				const exts = toMap(pay)
				const charges = exts.get('stripe_charges')
				if (charges) {
					const paid = Boolean(charges.paid)
					statePaymentPaid.set(this, paid)
				}
			}
		} catch(err) {
			console.error(err)
		}
		this.render()
	}
}
