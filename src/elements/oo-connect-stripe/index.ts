import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import openStripeOauth from '../../lib/open-stripe-oauth'
import {parse} from 'query-string'
import {OOUserUID} from '../../type/oo-user'
import connectApi from '../../lib/oo-api-connect-user-stripe'
import store from '../../lib/local-storage'
import {StripeConnectedDetail, StripeConnected, StripeConnectionFailedDetail, StripeConnectionFailed} from '../../type/event'
const {location} = window
import customEvent from '../../lib/custom-event'

define('oo-atoms-button', button)

type Connecntion = 'none' | 'disconnected' | 'connecting' | 'connected' | 'failed'

const URI_PARAMS = {
	CODE: 'code',
	STATE: 'state'
}
const EVENT = {
	CONNECTED: (detail: StripeConnectedDetail): StripeConnected => customEvent('connected', detail),
	CONNECTION_FAILED: (detail: StripeConnectionFailedDetail): StripeConnectionFailed => customEvent('connectionfailed', detail)
}

const stateUid = weakMap<string>()
const stateConnection = weakMap<Connecntion>()
const stripeWindow = weakMap<Window>()

export default class extends OOElement {
	get stripeWindow() {
		return stripeWindow.get(this)
	}

	constructor() {
		super()
		const {uid} = store
		if (typeof uid === 'string' && uid !== '') {
			stateUid.set(this, uid)
		}
		const {search} = location
		const params = parse(search)
		if (URI_PARAMS.CODE in params && URI_PARAMS.STATE in params) {
			this.onRedirected(params)
			stateConnection.set(this, 'connecting')
			this.update()
		} else {
			stateConnection.set(this, 'none')
			this.update()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const uid = stateUid.get(this)
		const connection = stateConnection.get(this)
		return html`
		<style>
		</style>
		${(() => {
			if (uid && connection === 'none') {
				return html`<oo-atoms-button on-clicked='${() => this.connectStripe()}'>Connect with your Stripe</oo-atoms-button>`
			} else if (connection === 'connecting') {
				return html`<oo-atoms-button data-state=progress>Connecting now...</oo-atoms-button>`
			} else if (connection === 'connected') {
				return html`<oo-atoms-button data-state=resolved>Connected!</oo-atoms-button>`
			} else if (connection === 'failed') {
				return html`<oo-atoms-button on-clicked='${() => this.connectStripe()}' data-state=rejected>Connection failed</oo-atoms-button>`
			}
			return html`<p>Sign in is required</p>`
		})()}
		`
	}

	connectStripe() {
		stripeWindow.set(this, openStripeOauth())
		stateConnection.set(this, 'connecting')
		this.update()
	}

	async onRedirected(params: {
		code: string,
		state: OOUserUID
	}, test?: boolean) {
		try {
			const connect = await connectApi(stateUid.get(this), params.code, test)
			const {response} = connect
			if (Array.isArray(response)) {
				const [uidAndStripe] = response
				stateConnection.set(this, 'connected')
				this.update()
				this.dispatchEvent(EVENT.CONNECTED(uidAndStripe))
			} else {
				throw connect
			}
		} catch(err) {
			stateConnection.set(this, 'failed')
			this.update()
			this.dispatchEvent(EVENT.CONNECTION_FAILED(err))
		}
	}
}
