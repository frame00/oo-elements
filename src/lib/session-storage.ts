const { sessionStorage } = window

type Key = 'oo:signing-in' | 'oo:previous-ask'

interface PreviousAsk {
	iam: string
	title: string
	body: string
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

export default {
	set signingIn(v) {
		set('oo:signing-in', v)
	},
	get signingIn() {
		return get('oo:signing-in')
	},
	set previousAsk(v: PreviousAsk) {
		set('oo:previous-ask', JSON.stringify(v))
	},
	get previousAsk(): PreviousAsk {
		const value = get('oo:previous-ask')
		try {
			return JSON.parse(value)
		} catch (err) {
			console.log(err)
			return
		}
	},
	remove(key: Key) {
		remove(key)
	},
	clear() {
		remove('oo:signing-in')
		remove('oo:previous-ask')
	}
}
