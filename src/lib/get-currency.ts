import currency from '../conf/currency'
import {Currency} from '../d/currency'
import getLangs from './get-langs'

export default (): Currency => {
	const languages = getLangs()
	const valid = languages.find(lang => Boolean(currency.get(lang)))
	if (valid) {
		return currency.get(valid)
	}
	return 'usd'
}
