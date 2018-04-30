import { Currency } from '../type/currency'
import getCurrency from './get-currency'

interface InitPrice {
	amount: 5 | 500
	currency: Currency
}

export default (currency?: Currency): InitPrice => {
	currency = currency || getCurrency()
	const amount = currency === 'usd' ? 5 : currency === 'jpy' ? 500 : 5
	return {
		currency,
		amount
	}
}
