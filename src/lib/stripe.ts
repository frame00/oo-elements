import {cdn} from '../conf/stripe'
const {document} = window

declare global {
	interface Window {
		StripeCheckout: any
	}
}

const load = (callback: (stripe: any) => void): void => {
	if (!('StripeCheckout' in window)) {
		const script = document.createElement('script')
		script.src = cdn
		script.onload = () => {
			callback(window.StripeCheckout)
		}
		document.body.appendChild(script)
	} else {
		callback(window.StripeCheckout)
	}
}

export default async (): Promise<any> => {
	const f = await new Promise(resolve => {
		load(stripe => {
			resolve(stripe)
		})
	})
	return f
}
