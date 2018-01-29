import {NotificationDetail} from '../d/event'
import notificationCenter from '../elements/oo-notification-center'
import define from './define'
const {document} = window

define('oo-notification-center', notificationCenter)

type StateKey = 'attach'

const state: Map<StateKey, boolean> = new Map()

export const attach = (): void => {
	if (!state.get('attach')) {
		const element = document.createElement('oo-notification-center')
		document.body.appendChild(element)
		state.set('attach', true)
	}
}

export const dispatch = (opts: NotificationDetail): boolean => {
	try {
		return document.dispatchEvent(new CustomEvent('oonotification', {detail: opts}))
	} catch(err) {
		return false
	}
}
