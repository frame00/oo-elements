import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getSign from '../../lib/oo-api-get-user-sign'
import getUser from '../../lib/oo-api-get-user'
import toMap from '../../lib/extensions-to-map'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import connectStripe from '../oo-connect-stripe'
import button from '../_atoms/oo-atoms-button'
import htmlPricePerHour from './lib/price-per-hour'
import {ExtensionPricePerHour} from '../../d/extension-price-per-hour'
import patchUser from '../../lib/oo-api-patch-user'

define('oo-connect-stripe', connectStripe)
define('oo-atoms-button', button)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}
interface Options {
	iam: string,
	name: string,
	skill: string,
	stripeUser: string,
	pricePerHour: ExtensionPricePerHour,
	buttonState: string
}

const stateIam = weakMap<string>()
const stateName = weakMap<string>()
const stateSkill = weakMap<string>()
const stateStripeUser = weakMap<string>()
const statePricePerHour = weakMap<ExtensionPricePerHour>()
const stateButton = weakMap<string>()

export default class extends HTMLElement {
	constructor() {
		super()
		this.fetchUserSign()
	}

	get iam() {
		return stateIam.get(this)
	}

	html(opts: Options) {
		const {iam, name, skill, stripeUser, pricePerHour, buttonState} = opts
		if (typeof iam !== 'string') {
			return html``
		}
		const options = [
			{name: 'name', title: 'Display name', template: html`<input name=name type=text value$='${name}' on-change='${e => this.onChange(e, 'name')}'></input>`},
			{name: 'skill', title: 'Skill', template: html`<textarea name=skill on-change='${e => this.onChange(e, 'skill')}'>${skill}</textarea>`},
			{name: 'price_per_hour', title: 'Price per hour', template: htmlPricePerHour(pricePerHour, {
				usd: (e, cur) => this.onChange(e, cur), jpy: (e, cur) => this.onChange(e, cur)
			})},
			{name: 'stripe', title: 'Stripe', template: html`<oo-connect-stripe data-iam$='${iam}'></oo-connect-stripe>
			${(() => {
				if (typeof stripeUser === 'string') {
					return html`<p><span class='state success'>Connected</span></p>`
				}
				return html`<p><span class='state error'>Disconnected</span></p>`
			})()}`}
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
			textarea,
			input {
				@mixin textarea;
			}
			input {
				height: 3rem;
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
			skill: stateSkill.get(this),
			stripeUser: stateStripeUser.get(this),
			pricePerHour: statePricePerHour.get(this),
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
			stateSkill.set(this, ext.get('skill'))
			stateStripeUser.set(this, ext.get('stripe_user_id'))
			statePricePerHour.set(this, ext.get('price_per_hour'))
			this.render()
		} else {
			this.render()
		}
	}

	onChange(e: HTMLElementEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) {
		const {target} = e
		const {value} = target
		switch(name) {
			case 'name':
				stateName.set(this, value)
				break
			case 'skill':
				stateSkill.set(this, value)
				break
			case 'usd':
				const usd = {usd: Number(value)}
				statePricePerHour.set(this, {...statePricePerHour.get(this), ...usd})
				break
			case 'jpy':
				const jpy = {jpy: Number(value)}
				statePricePerHour.set(this, {...statePricePerHour.get(this), ...jpy})
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
			skill: stateSkill.get(this),
			price_per_hour: statePricePerHour.get(this)
		}
		const res = await patchUser(stateIam.get(this), extensions)
		const {response} = res
		if (Array.isArray(response)) {
			stateButton.set(this, 'resolved')
		} else {
			stateButton.set(this, 'rejected')
		}
		this.render()
	}
}
