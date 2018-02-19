import {NotificationDetail} from '../type/event'
import notificationCenter from '../elements/oo-notification-center'
import define from './define'
import customEvent from './custom-event'
const {document} = window

define('oo-notification-center', notificationCenter)

const attached: WeakMap<Window, boolean> = new WeakMap()

export const attach = (): void => {
	if (!attached.get(window)) {
		const element = document.createElement('oo-notification-center')
		document.body.appendChild(element)
		attached.set(window, true)
	}
}

export const dispatch = (opts: NotificationDetail): boolean => {
	try {
		return document.dispatchEvent(customEvent('oonotification', opts))
	} catch(err) {
		return false
	}
}
