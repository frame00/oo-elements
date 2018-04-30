const { localStorage } = window

type Key = 'oo:token' | 'oo:uid'

const get = (key: Key): string => {
	return localStorage.getItem(key)
}
const set = (key: Key, value): void => {
	localStorage.setItem(key, value)
}
const remove = (key: Key): void => {
	localStorage.removeItem(key)
}

export default class {
	static get token() {
		return get('oo:token')
	}
	static set token(v) {
		set('oo:token', v)
	}
	static get uid() {
		return get('oo:uid')
	}
	static set uid(v) {
		set('oo:uid', v)
	}

	static remove(key: Key) {
		remove(key)
	}
	static clear() {
		remove('oo:token')
		remove('oo:uid')
	}
}
