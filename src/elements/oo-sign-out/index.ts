import {OOElement} from '../oo-element'
import {html} from '../../lib/html'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import {attach, dispatch} from '../../lib/notification'
import store from '../../lib/local-storage'
import deleteToken from '../../lib/oo-api-delete-token'
import isSuccess from '../../lib/is-api-success'
import customEvent from '../../lib/custom-event'
import weakMap from '../../lib/weak-map'

define('oo-atoms-button', button)

const EVENT = {
	SIGNED_OUT: customEvent('signedout')
}

const stateProggres = weakMap<boolean>()

export default class extends OOElement {
	constructor() {
		super()
		attach()
		const {uid} = store
		if (typeof uid === 'string' && uid !== '') {
			this.update()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const progress = stateProggres.get(this)
		return html`
		<style>
		</style>
		<oo-atoms-button
			data-state$='${progress ? 'progress' : ''}'
			on-clicked='${() => this.signOut()}'>Sign out</oo-atoms-button>
		`
	}

	async signOut() {
		stateProggres.set(this, true)
		this.update()
		const del = await deleteToken()
		const {status} = del
		if (isSuccess(status)) {
			store.clear()
			dispatch({
				message: 'See you again',
				type: 'success'
			})
			this.dispatchEvent(EVENT.SIGNED_OUT)
		} else {
			dispatch({
				message: 'Failed to signing out',
				type: 'error'
			})
		}
		stateProggres.delete(this)
		this.update()
	}
}
