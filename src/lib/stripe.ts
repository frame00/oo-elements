import { cdn } from '../conf/stripe'
const { document } = window

declare global {
	interface Window {
		StripeCheckout: any
	}
}

const load = (callback: (stripe: any) => void): void => {
	if ('StripeCheckout' in window) {
		return callback(window.StripeCheckout)
	}
	const script = document.createElement('script')
	script.src = cdn
	script.onload = () => {
		callback(window.StripeCheckout)
	}
	document.body.appendChild(script)
}

export default async (): Promise<any> =>
	new Promise(resolve => {
		load(stripe => {
			resolve(stripe)
		})
	})
