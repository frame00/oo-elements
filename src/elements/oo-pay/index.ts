import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import weakMap from '../../lib/weak-map'
import { Currency } from '../../type/currency'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import button from '../_atoms/oo-atoms-button'
import define from '../../lib/define'
import { currencyToSign } from '../../lib/get-price-per-hour'
import stripeCheckout from '../../lib/payment-handler-by-stripe'
import getPayment from '../../lib/oo-api-get-payment'
import toMap from '../../lib/extensions-to-map'
import asStripeAmount from './lib/as-stripe-amount'
import stripeCallback from './lib/stripe-callback'
import { attach, dispatch } from '../../lib/notification'
import clientGetUser from '../../lib/oo-client-get-user'
import { OOUserWithMapedExtensions } from '../../type/oo-user'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', button)

interface Options {
	iam: string
	uid: string
	dest: string
	amount: string
	currency: Currency
	paymentUid?: string
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
const stateUser = weakMap<OOUserWithMapedExtensions>()
const statePaymentFetching = weakMap<boolean>()
const stateProgress = weakMap<boolean>()
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
	const { iam, uid, dest, amount, currency } = opts
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
	if (
		typeof data === 'string' &&
		data !== 'undefined' &&
		data !== 'null' &&
		data !== ''
	) {
		return true
	}
	return false
}
const onBeforeunloadCallback = e => {
	const message = 'Do you want to leave this page?\nPayment is not completed.'
	e.returnValue = message
	return message
}

export default class extends OOElement {
	static get observedAttributes() {
		return [
			ATTR.DATA_IAM,
			ATTR.DATA_UID,
			ATTR.DATA_DEST,
			ATTR.DATA_AMOUNT,
			ATTR.DATA_CURRENCY,
			ATTR.DATA_PAYMENT_UID
		]
	}

	get paid() {
		return statePaymentPaid.get(this)
	}

	get user() {
		return stateUser.get(this)
	}

	constructor() {
		super()
		attach()
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next && !next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_IAM:
				stateIam.set(this, next)
				this.fetchUser(next)
					.then()
					.catch()
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
					.then()
					.catch()
				break
			default:
		}
		if (this.connected) {
			this.update()
		}
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
		const progress = stateProgress.get(this)
		if (isFullFilledRequiredStates(opts) === false) {
			return html``
		}
		const { iam, currency, amount, paymentPaid, chargeSuccessed } = opts
		const sign = currencyToSign(currency)
		const done = paymentPaid === true
		const paymentButton = done
			? html``
			: (() => {
					const state =
						chargeSuccessed === true
							? 'resolved'
							: chargeSuccessed === false
								? 'rejected'
								: progress
									? 'progress'
									: ''
					return html`
			<oo-atoms-button on-clicked='${async () =>
				this.stripeCheckout()
					.then()
					.catch()}' data-state$='${state}' data-block=enabled>Pay</oo-atoms-button>`
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

	async fetchUser(iam: string) {
		const user = await clientGetUser(iam)
		if (typeof user === 'boolean') {
			return
		}
		stateUser.set(this, user)
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
		const beforeCallback = () => {
			statePaymentFetching.set(this, true)
			stateProgress.set(this, true)
			this.update()
		}
		const afterCallback = (err, results) => {
			if (err) {
				stateChargeSuccessed.set(this, false)
			} else {
				const { response } = results
				if (Array.isArray(response)) {
					const [data] = response
					statePaymentUid.set(this, data.uid)
					statePaymentPaid.set(this, true)
					stateChargeSuccessed.set(this, true)
					dispatch({ message: 'Payment has been completed.', type: 'success' })
				} else {
					stateChargeSuccessed.set(this, false)
					dispatch({ message: response.message, type: 'error' })
				}
			}
			stateProgress.delete(this)
			this.update()
			statePaymentFetching.set(this, false)
			this.onBeforeunload(true)
		}
		const callback = stripeCallback(options, beforeCallback, afterCallback)
		try {
			const user = stateUser.get(this)
			const currency = stateCurrency.get(this)
			const amount = asStripeAmount(stateAmount.get(this), currency)
			const name = user ? user.MapedExtensions.get('name') : 'Double O'
			const image = user && user.MapedExtensions.get('picture')
			const handler = await stripeCheckout(callback, image)
			handler.open({
				name,
				description: '',
				amount,
				currency,
				opened: () => this.onBeforeunload(),
				closed: () => {
					if (statePaymentFetching.get(this) !== true) {
						this.onBeforeunload(true)
					}
				}
			})
		} catch (err) {
			console.error(err)
		}
		if (test === false) {
			return
		}
		callback(testData)
			.then()
			.catch()
	}

	onBeforeunload(remove: boolean = false) {
		if (remove) {
			window.removeEventListener('beforeunload', onBeforeunloadCallback, false)
		} else {
			window.addEventListener('beforeunload', onBeforeunloadCallback, false)
		}
	}

	async fetchPayment() {
		const uid = statePaymentUid.get(this)
		if (validUid(uid) === false) {
			statePaymentPaid.set(this, false)
			this.update()
			return
		}
		try {
			const payment = await getPayment(uid)
			const { response } = payment
			if (Array.isArray(response)) {
				const [pay] = response
				const exts = toMap(pay)
				const charges = exts.get('stripe_charges')
				if (charges) {
					const paid = Boolean(charges.paid)
					statePaymentPaid.set(this, paid)
				}
			}
		} catch (err) {
			console.error(err)
		}
		this.update()
	}
}
