import {html} from 'lit-html'
import render from '../../lib/render'
import weakMap from '../../lib/weak-map'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import openStripeOauth from '../../lib/open-stripe-oauth'
import {parse} from 'query-string'
import {OOUserUID} from '../../d/oo-user'
import connectApi from '../../lib/oo-api-connect-user-stripe'
import store from '../../lib/local-storage'
const {location} = window

define('oo-atoms-button', button)

type Connecntion = 'none' | 'disconnected' | 'connecting' | 'connected' | 'failed'

const URI_PARAMS = {
	CODE: 'code',
	STATE: 'state'
}
const EVENT = {
	CONNECTED: detail => new CustomEvent('connected', {detail}),
	CONNECTION_FAILED: detail => new CustomEvent('connectionfailed', {detail})
}

const stateUid = weakMap<string>()
const stateConnection = weakMap<Connecntion>()

export default class extends HTMLElement {
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
			this.render()
		} else {
			stateConnection.set(this, 'none')
			this.render()
		}
	}

	html(uid: string, connection: Connecntion) {
		return html`
		<style>
		</style>
		${(() => {
			if (uid && connection === 'none') {
				return html`<oo-atoms-button on-clicked='${() => this.connectStripe()}'>Connect with Stripe</oo-atoms-button>`
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

	render() {
		render(this.html(stateUid.get(this), stateConnection.get(this)), this)
	}

	async connectStripe() {
		openStripeOauth()
		stateConnection.set(this, 'connecting')
		this.render()
	}

	async onRedirected(params: {
		code: string,
		state: OOUserUID
	}) {
		try {
			const connect = await connectApi(params.code)
			const {response} = connect
			if (Array.isArray(response)) {
				const [uidAndStripe] = response
				stateConnection.set(this, 'connected')
				this.render()
				this.dispatchEvent(EVENT.CONNECTED(uidAndStripe))
			} else {
				throw response
			}
		} catch(err) {
			stateConnection.set(this, 'failed')
			this.render()
			this.dispatchEvent(EVENT.CONNECTION_FAILED(err))
		}
	}
}
