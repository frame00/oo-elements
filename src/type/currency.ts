export type Usd = 'usd'
export type Jpy = 'jpy'
export type DollarSign = '$'
export type YenSign = '¥'

export type Currency = Usd | Jpy
export type CurrencySign = DollarSign | YenSign

export interface LocaledCurrency {
	currency: Currency
	price: number
	sign: CurrencySign
}
