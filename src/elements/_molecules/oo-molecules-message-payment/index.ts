import {html} from 'lit-html'
import render from '../../../lib/render'
import weakMap from '../../../lib/weak-map'
import {Currency} from '../../../d/currency'
import ooMessage from '../../_atoms/oo-atoms-message'
import ooUserName from '../../_atoms/oo-atoms-user-name'
import button from '../../_atoms/oo-atoms-button'
import define from '../../../lib/define'
import {currencyToSign} from '../../../lib/get-price-per-hour'
import stripeCheckout from '../../../lib/payment-handler-by-stripe'
import {StripeCheckoutToken} from '../../../d/stripe'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', button)

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
		const {iam, currency, amount, paymentUid} = opts
		const sign = currencyToSign(currency)
		const done = typeof paymentUid === 'string'
		const paymentButton = done ? html`` : html`<oo-atoms-button on-clicked='${() => this.stripeCheckout()}' data-block=enabled>Pay</oo-atoms-button>`
		return html`
		<style>
		@import '../../../style/_vars-font-family.css';
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
				<article class$='${paymentUid ? 'done' : 'wait'}'>
					<header>${currency} ${sign}${amount}</header>
					<div class=pay>
						${paymentButton}
						<oo-atoms-user-name data-iam$=${iam} data-size=small></oo-atoms-user-name>
					</div>
				</article>
			</section>
		</oo-atoms-message>
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

	async stripeCheckout() {
		const callback = (token: StripeCheckoutToken): void => {
			console.log(token)
		}
		const handler = await stripeCheckout(callback)
		const amount = parseFloat(stateAmount.get(this)) * 100
		handler.open({
			name: 'Stripe.com',
			description: '2 widgets',
			amount
		})
	}
}
