import {OOElement} from '../oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {html} from '../../lib/html'
import getSign from '../../lib/oo-api-get-user-sign'
import getUser from '../../lib/oo-api-get-user'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import connectStripe from '../oo-connect-stripe'
import patchUser from '../../lib/oo-api-patch-user'
import {attach, dispatch} from '../../lib/notification'

define('oo-connect-stripe', connectStripe)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const stateIam = weakMap<string>()
const stateName = weakMap<string>()
const stateBio = weakMap<string>()
const stateEMail = weakMap<string>()
const stateStripeUser = weakMap<string>()
const stateNotificationEMail = weakMap<boolean>()
const stateNotificationEMailServiceInformation = weakMap<boolean>()
const stateButton = weakMap<string>()

export default class extends OOElement {
	constructor() {
		super()
		this.fetchUserSign()
		attach()
	}

	get iam() {
		return stateIam.get(this)
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const {iam, name, bio, email, stripeUser, notificationEMail, notificationEMailServiceInformation, buttonState} = {
			iam: stateIam.get(this),
			name: stateName.get(this),
			bio: stateBio.get(this),
			email: stateEMail.get(this),
			stripeUser: stateStripeUser.get(this),
			notificationEMail: stateNotificationEMail.get(this),
			notificationEMailServiceInformation: stateNotificationEMailServiceInformation.get(this),
			buttonState: stateButton.get(this)
		}
		if (typeof iam !== 'string') {
			return html``
		}
		const options = [
			{name: 'uid', title: 'Your ID', template: html`<input name=iam type=text value$='${iam}' disabled></input>`},
			{name: 'name', title: 'Display name', template: html`<input name=name type=text value$='${name}' on-change='${e => this.onChange(e, 'name')}' required></input>`},
			{name: 'bio', title: 'Profile', template: html`<textarea name=bio on-change='${e => this.onChange(e, 'bio')}'>${bio}</textarea>`},
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
			`},
			{name: 'email', title: 'E-Mail address', template: html`<input name=email type=email value$='${email}' on-change='${e => this.onChange(e, 'email')}' required></input>`}
		]
		return html`
		<style>
			@import '../../style/_mixin-button.css';
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
			button {
				margin-top: 3rem;
				@mixin button;
			}
		</style>
		<main>
			<form on-submit='${e => this.onSubmit(e)}'>
				<dl>
					${repeat(options, opt => {
						const {title, template} = opt
						return html`
						<dt>${title}</dt>
						<dd>${template}</dd>
						`
					})}
				</dl>
				<button class$='${buttonState}'>Save</button>
			</form>
		</main>
		`
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
			this.update()
		}
	}

	async fetchUserData(uid: string) {
		const res = await getUser(uid)
		const {response} = res
		if (Array.isArray(response)) {
			const [item] = response
			const ext = toMap(item)
			const email = ext.get('email')
			stateName.set(this, ext.get('name'))
			stateBio.set(this, ext.get('bio'))
			stateEMail.set(this, typeof email === 'string' ? email : '')
			stateStripeUser.set(this, ext.get('stripe_user_id'))
			stateNotificationEMail.set(this, ext.get('notifications_opt_email'))
			stateNotificationEMailServiceInformation.set(this, ext.get('notifications_opt_email_service_information'))
			this.update()
		} else {
			this.update()
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
			case 'email':
				stateEMail.set(this, value)
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

	async onSubmit(e: Event) {
		e.preventDefault()
		stateButton.set(this, 'progress')
		this.update()
		const extensions = {
			name: stateName.get(this),
			bio: stateBio.get(this),
			email: stateEMail.get(this),
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
		this.update()
	}
}
