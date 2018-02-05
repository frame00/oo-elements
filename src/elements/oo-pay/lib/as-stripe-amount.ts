import {Currency} from '../../../type/currency'

export default (data: string, cur: Currency): number => {
	switch(cur) {
		case 'usd':
			return parseFloat(data) * 100
		default:
			return ~~Number(data)
	}
}
