import {OOExtensionsLikeObject} from '../type/oo-extension'
import {AllowedParametersInBody} from '../type/oo-message'
import {parse} from 'toml'

interface Response extends AllowedParametersInBody {
	body: string
}

const validater = {
	type(d: string): boolean {
		if (d === 'pay') {
			return true
		}
		return false
	},
	amount(d: string): boolean {
		if (typeof d === 'number') {
			return true
		}
		return false
	},
	currency(d: string): boolean {
		if (d === 'usd' || d === 'jpy') {
			return true
		}
		return false
	}
}

const asAllowdParams = (exts: OOExtensionsLikeObject): AllowedParametersInBody => {
	const {type, amount, currency} = exts
	const res: AllowedParametersInBody = {}
	if (type !== undefined) {
		if (validater.type(type)) {
			res.type = type
		} else {
			throw new Error('invalid message extension/type')
		}
		if (validater.type(type) && (!validater.amount(amount) || !validater.currency(currency))) {
			throw new Error('incorrect "amount" or "currency"')
		}
	}
	if (amount !== undefined) {
		if (typeof amount === 'number') {
			res.amount = amount
		} else {
			throw new Error('invalid message extension/amount')
		}
	}
	if (currency !== undefined) {
		if (currency === 'usd' || currency === 'jpy') {
			res.currency = currency
		} else {
			throw new Error('invalid message extension/currency')
		}
	}
	return res
}

export default (row: string): Response => {
	const [area = '', tml = ''] = /\+\+\+([\W\w]*)\+\+\+/.exec(row) || []
	const body = row.replace(area, '').trim()
	const extensions: OOExtensionsLikeObject = asAllowdParams(parse(tml))
	return {...extensions, ...{body}}
}
