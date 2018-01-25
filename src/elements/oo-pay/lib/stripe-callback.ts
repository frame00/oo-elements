import {StripeCheckoutToken} from '../../../d/stripe'
import asStripeAmount from './as-stripe-amount'
import chargePayment from '../../../lib/oo-api-charge-payment'
import Pay from '../index'
import {Currency} from '../../../d/currency'
import {OOAPIResult} from '../../../d/oo-api'
import {OOPayment} from '../../../d/oo-payment'

interface Options {
	amount: string,
	currency: Currency,
	iam: string,
	uid: string
}

export default (el: Pay, opts: Options, callback: (err: Error, res: OOAPIResult<OOPayment>) => void) => {
	const {amount, currency, iam, uid} = opts
	return async (token: StripeCheckoutToken): Promise<void> => {
		const options = {
			stripe_token: token.id,
			amount: asStripeAmount(amount),
			seller_uid: iam,
			linked_message_uid: uid,
			currency
		}
		try {
			const payment = await chargePayment(options)
			callback(null, payment)
		} catch(err) {
			callback(err, null)
		}
	}
}
