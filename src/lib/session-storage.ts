const {sessionStorage} = window

type Key = 'oo:signing-in'

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

	static remove(key: Key) {
		remove(key)
	}
	static clear() {
		remove('oo:signing-in')
	}
}
