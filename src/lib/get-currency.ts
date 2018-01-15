import currency from '../conf/currency'
import {Currency} from '../d/currency'
const {navigator} = window

export default (): Currency => {
	const {languages} = navigator
	const valid = languages.find(lang => Boolean(currency.get(lang)))
	if (valid) {
		return currency.get(valid)
	}
	return 'usd'
}
