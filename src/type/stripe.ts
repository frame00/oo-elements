import { Currency } from './currency'

export interface StripeCheckoutToken {
	client_ip: string
	created: number
	email: string
	id: string
	livemode: boolean
	object: string
	type: string
	used: boolean
}

export interface StripeCheckoutHandlerOpenOptions {
	name: string
	description: string
	zipCode?: boolean
	amount: number
	currency: Currency
	opened?: Function
	closed?: Function
}

export interface StripeCheckoutHandler {
	open(opts: StripeCheckoutHandlerOpenOptions): void
}
