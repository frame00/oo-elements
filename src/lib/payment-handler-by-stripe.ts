import stripe from './stripe'
import {publicKey} from '../conf/stripe'
import {StripeCheckoutHandler, StripeCheckoutToken} from '../type/stripe'

export default async (callback: (token: StripeCheckoutToken) => void, image?: string): Promise<StripeCheckoutHandler> => {
	const stripeCheckout = await stripe()
	const handler: StripeCheckoutHandler = stripeCheckout.configure({
		key: publicKey,
		image: image || 'https://stripe.com/img/documentation/checkout/marketplace.png',
		locale: 'auto',
		token: callback
	})
	return handler
}
