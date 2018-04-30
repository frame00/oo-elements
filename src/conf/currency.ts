import { Currency } from '../type/currency'

const USD = 'usd'
const JPY = 'jpy'

export default new Map<string, Currency>([
	['en-US', USD],
	['ja-JP', JPY],
	['en', USD],
	['ja', JPY]
])
