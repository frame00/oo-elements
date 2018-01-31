import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
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

export default class extends HTMLElement {
	private callback = e => this.notificationListener(e)

	connectedCallback() {
		notificationList.set(this, [])
		document.addEventListener('oonotification', this.callback)
	}

	disconnectedCallback() {
		document.removeEventListener('oonotification', this.callback)
	}

	html(items: NotificationList) {
		return html`
		<style>
			div {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				padding: 1rem;
				box-sizing: border-box;
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

	render() {
		render(this.html(notificationList.get(this)), this)
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
		this.render()
	}

	closeNotification(index: number) {
		const current = notificationList.get(this)
		current.splice(index, 1)
		notificationList.set(this, current)
		this.render()
	}
}
