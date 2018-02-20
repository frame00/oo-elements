import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../lib/html'
import getSign from '../../lib/oo-api-get-user-sign'
import getUser from '../../lib/oo-api-get-user'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import connectStripe from '../oo-connect-stripe'
import button from '../_atoms/oo-atoms-button'
import patchUser from '../../lib/oo-api-patch-user'
import {attach, dispatch} from '../../lib/notification'

define('oo-connect-stripe', connectStripe)
define('oo-atoms-button', button)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}
interface Options {
	iam: string,
	name: string,
	bio: string,
	stripeUser: string,
	buttonState: string,
	notificationEMail: boolean,
	notificationEMailServiceInformation: boolean
}

const stateIam = weakMap<string>()
const stateName = weakMap<string>()
const stateBio = weakMap<string>()
const stateStripeUser = weakMap<string>()
const stateNotificationEMail = weakMap<boolean>()
const stateNotificationEMailServiceInformation = weakMap<boolean>()
const stateButton = weakMap<string>()

export default class extends HTMLElement {
	constructor() {
		super()
		this.fetchUserSign()
		attach()
	}

	get iam() {
		return stateIam.get(this)
	}

	html(opts: Options) {
		const {iam, name, bio, stripeUser, notificationEMail, notificationEMailServiceInformation, buttonState} = opts
		if (typeof iam !== 'string') {
			return html``
		}
		const options = [
			{name: 'name', title: 'Display name', template: html`<input name=name type=text value$='${name}' on-change='${e => this.onChange(e, 'name')}'></input>`},
			{name: 'bio', title: 'Bio', template: html`<textarea name=bio on-change='${e => this.onChange(e, 'bio')}'>${bio}</textarea>`},
			{name: 'stripe', title: 'Stripe', template: html`<oo-connect-stripe data-iam$='${iam}'></oo-connect-stripe>
			${(() => {
				if (typeof stripeUser === 'string') {
					return html`<p><span class='state success'>Connected</span></p>`
				}
				return html`<p><span class='state error'>Disconnected</span></p>`
			})()}`},
			{name: 'notifications-email', title: 'E-Mail notification', template: html`
				<label>
					<input name=notifications_opt_email type=checkbox checked?='${notificationEMail}' on-change='${e => this.onChange(e, 'notifications_opt_email')}'></input>
					New project and message
				</label>
				<label>
					<input name=notifications_opt_email_service_information type=checkbox checked?='${notificationEMailServiceInformation}' on-change='${e => this.onChange(e, 'notifications_opt_email_service_information')}'></input>
					New features of Double O
				</label>
			`}
		]
		return html`
		<style>
			@import '../../style/_mixin-heading.css';
			@import '../../style/_mixin-textarea.css';
			@import '../../style/_vars-input.css';
			:host {
				display: block;
			}
			main {}
			dl,
			dd {
				margin: 0;
			}
			dt {
				@mixin heading;
			}
			dd {
			}
			label {
				display: block;
			}
			textarea,
			input:not([type=checkbox]) {
				@mixin textarea;
			}
			input:not([type=checkbox]) {
				height: 3rem;
			}
			input[type=checkbox] {
				margin-right: 0.5rem;
			}
			.state {
				display: inline-block;
				padding: 0.2rem 0.4rem;
				border-radius: 2px;
				font-size: 0.8rem;
				color: white;
				&.error {
					background: var(--rejected-background);
				}
				&.success {
					background: var(--resolved-background);
				}
			}
			oo-atoms-button {
				margin-top: 3rem;
			}
		</style>
		<main>
			<dl>
				${repeat(options, opt => {
					const {title, template} = opt
					return html`
					<dt>${title}</dt>
					<dd>${template}</dd>
					`
				})}
			</dl>
			<oo-atoms-button data-state$='${buttonState}' on-clicked='${() => this.onButtonClick()}'>Save</oo-atoms-button>
		</main>
		`
	}

	render() {
		const opts = {
			iam: stateIam.get(this),
			name: stateName.get(this),
			bio: stateBio.get(this),
			stripeUser: stateStripeUser.get(this),
			notificationEMail: stateNotificationEMail.get(this),
			notificationEMailServiceInformation: stateNotificationEMailServiceInformation.get(this),
			buttonState: stateButton.get(this)
		}
		render(this.html(opts), this)
	}

	async fetchUserSign() {
		const res = await getSign()
		const {response} = res
		if (Array.isArray(response)) {
			const [uid] = response
			stateIam.set(this, uid)
			this.fetchUserData(uid)
		} else {
			stateIam.delete(this)
			dispatch({message: 'You are not signed in.', type: 'error'})
			this.render()
		}
	}

	async fetchUserData(uid: string) {
		const res = await getUser(uid)
		const {response} = res
		if (Array.isArray(response)) {
			const [item] = response
			const ext = toMap(item)
			stateName.set(this, ext.get('name'))
			stateBio.set(this, ext.get('bio'))
			stateStripeUser.set(this, ext.get('stripe_user_id'))
			stateNotificationEMail.set(this, ext.get('notifications_opt_email'))
			stateNotificationEMailServiceInformation.set(this, ext.get('notifications_opt_email_service_information'))
			this.render()
		} else {
			this.render()
			dispatch({message: 'Could not get user.', type: 'error'})
		}
	}

	onChange(e: HTMLElementEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) {
		const {target} = e
		const {value} = target
		switch(name) {
			case 'name':
				stateName.set(this, value)
				break
			case 'bio':
				stateBio.set(this, value)
				break
			case 'notifications_opt_email':
				const {checked} = target as HTMLInputElement
				stateNotificationEMail.set(this, checked)
				break
			case 'notifications_opt_email_service_information':
				const {checked: chcd} = target as HTMLInputElement
				stateNotificationEMailServiceInformation.set(this, chcd)
				break
			default:
				break
		}
	}

	async onButtonClick() {
		stateButton.set(this, 'progress')
		this.render()
		const extensions = {
			name: stateName.get(this),
			bio: stateBio.get(this),
			notifications_opt_email: stateNotificationEMail.get(this),
			notifications_opt_email_service_information: stateNotificationEMailServiceInformation.get(this)
		}
		const res = await patchUser(stateIam.get(this), extensions)
		const {response} = res
		if (Array.isArray(response)) {
			stateButton.set(this, 'resolved')
		} else {
			stateButton.set(this, 'rejected')
			dispatch({message: 'User update failed. Please try again.', type: 'error'})
		}
		this.render()
	}
}
