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

export default {
	get token() {
		return get('oo:token')
	},
	set token(v) {
		set('oo:token', v)
	},
	get uid() {
		return get('oo:uid')
	},
	set uid(v) {
		set('oo:uid', v)
	},
	remove(key: Key) {
		remove(key)
	},
	clear() {
		remove('oo:token')
		remove('oo:uid')
	}
}
