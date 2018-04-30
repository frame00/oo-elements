import { Currency } from '../type/currency'
import getCurrency from './get-currency'

interface InitPrice {
	amount: 5 | 500
	currency: Currency
}

export default (currency?: Currency): InitPrice => {
	const c = currency || getCurrency()
	const amount = c === 'usd' ? 5 : c === 'jpy' ? 500 : 5
	return {
		currency: c,
		amount
	}
}
