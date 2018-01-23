export interface StripeCheckoutToken {
	amount: number,
	id: string
}

export interface StripeCheckoutHandlerOpenOptions {
	name: string,
	description: string,
	zipCode?: boolean,
	amount: number
}

export interface StripeCheckoutHandler {
	open: (opts: StripeCheckoutHandlerOpenOptions) => void
}
