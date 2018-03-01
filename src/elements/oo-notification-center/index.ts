import {OOElement} from '../oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {html} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import notification from '../oo-notification'
import {DocumentNotificationEvent, NotificationType} from '../../type/event'
const {document} = window

define('oo-notification', notification)

type NotificationList = Array<{
	message: string,
	type?: NotificationType
}>

const notificationList = weakMap<NotificationList>()

export default class extends OOElement {
	private callback = e => this.notificationListener(e)

	connectedCallback() {
		notificationList.set(this, [])
		super.connectedCallback()
		document.addEventListener('oonotification', this.callback)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		document.removeEventListener('oonotification', this.callback)
	}

	render() {
		const items = notificationList.get(this)
		return html`
		<style>
			div {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				padding: 1rem;
				box-sizing: border-box;
				z-index: 1001;
			}
			oo-notification {
				margin-bottom: 1rem;
			}
		</style>
		<div>
			${repeat(items, (item, i) => {
				const {message, type} = item
				return html`
				<oo-notification data-type$='${type}' on-click='${() => this.closeNotification(i)}'>
					<span slot=body>${message}</span>
				<oo-notification>
				`
			})}
		</div>
		`
	}

	notificationListener(e: DocumentNotificationEvent) {
		const current = notificationList.get(this)
		const {detail} = e
		const {message, type} = detail
		current.push({
			message,
			type
		})
		notificationList.set(this, current)
		this.update()
	}

	closeNotification(index: number) {
		const current = notificationList.get(this)
		current.splice(index, 1)
		notificationList.set(this, current)
		this.update()
	}
}
