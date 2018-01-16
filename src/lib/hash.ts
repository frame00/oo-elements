const {addEventListener, removeEventListener, location} = window

const callbacks: WeakMap<object, EventListenerOrEventListenerObject> = new WeakMap()

export const add = (clas: HTMLElement, callback: EventListenerOrEventListenerObject): void => {
	callbacks.set(clas, callback)
	addEventListener('hashchange', callbacks.get(clas))
}

export const remove = (clas: HTMLElement): void => {
	removeEventListener('hashchange', callbacks.get(clas))
	callbacks.delete(clas)
}

export const change = (hash: string): string => (location.hash = hash)

export const get = (): string => location.hash.replace(/^#/, '')
