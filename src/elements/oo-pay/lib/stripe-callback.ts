import { StripeCheckoutToken } from '../../../type/stripe'
import asStripeAmount from './as-stripe-amount'
import chargePayment from '../../../lib/oo-api-charge-payment'
import { Currency } from '../../../type/currency'
import { OOAPIResult } from '../../../type/oo-api'
import { OOPayment } from '../../../type/oo-payment'

interface Options {
	amount: string
	currency: Currency
	iam: string
	uid: string
}

export default (
	opts: Options,
	beforeCallback: Function,
	callback: (err: Error, res: OOAPIResult<OOPayment>) => void
) => {
	const { amount, currency, iam, uid } = opts
	return async (token: StripeCheckoutToken): Promise<void> => {
		if (typeof beforeCallback === 'function') {
			beforeCallback()
		}
		const options = {
			stripe_token: token.id,
			amount: asStripeAmount(amount, currency),
			seller_uid: iam,
			linked_message_uid: uid,
			currency
		}
		try {
			const payment = await chargePayment(options)
			callback(null, payment)
		} catch (err) {
			callback(err, null)
		}
	}
}
