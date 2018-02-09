import {Scope} from '../type/scope'
import {Currency} from '../type/currency'

const {sessionStorage} = window

type Key = 'oo:signing-in' | 'oo:previous-ask'

interface PreviousAsk {
	iam: string,
	body: string,
	scope: Scope,
	currency: Currency
}

const get = (key: Key): string => {
	return sessionStorage.getItem(key)
}
const set = (key: Key, value): void => {
	sessionStorage.setItem(key, value)
}
const remove = (key: Key): void => {
	sessionStorage.removeItem(key)
}

export default class {
	static set signingIn(v) {
		set('oo:signing-in', v)
	}
	static get signingIn() {
		return get('oo:signing-in')
	}
	static set previousAsk(v: PreviousAsk) {
		set('oo:previous-ask', JSON.stringify(v))
	}
	static get previousAsk(): PreviousAsk {
		const value = get('oo:previous-ask')
		try {
			return JSON.parse(value)
		} catch(err) {
			return
		}
	}

	static remove(key: Key) {
		remove(key)
	}
	static clear() {
		remove('oo:signing-in')
		remove('oo:previous-ask')
	}
}
