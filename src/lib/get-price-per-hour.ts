import getCurrency from './get-currency'
import { Currency, CurrencySign, LocaledCurrency } from '../type/currency'
import { ExtensionPricePerHour } from '../type/extension-price-per-hour'

export const currencyToSign = (cur: Currency): CurrencySign => {
	switch (cur) {
		case 'usd':
			return '$'
		case 'jpy':
			return '¥'
		default:
			return '$'
	}
}

export default (ext: ExtensionPricePerHour): LocaledCurrency => {
	const currency = getCurrency()
	if (currency in ext) {
		return {
			currency,
			price: ext[currency],
			sign: currencyToSign(currency)
		}
	}
	if (ext.usd !== undefined) {
		return {
			currency: 'usd',
			price: ext.usd,
			sign: currencyToSign(currency)
		}
	}
	if (ext.jpy !== undefined) {
		return {
			currency: 'jpy',
			price: ext.jpy,
			sign: currencyToSign(currency)
		}
	}
}
