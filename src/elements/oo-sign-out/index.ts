import {html, render} from '../../lib/html'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import {attach, dispatch} from '../../lib/notification'
import store from '../../lib/local-storage'
import deleteToken from '../../lib/oo-api-delete-token'
import isSuccess from '../../lib/is-api-success'

define('oo-atoms-button', button)

const EVENT = {
	SIGNED_OUT: new Event('signedout')
}

export default class extends HTMLElement {
	constructor() {
		super()
		attach()
		const {uid} = store
		if (typeof uid === 'string' && uid !== '') {
			this.render()
		}
	}

	html(progress: boolean) {
		return html`
		<style>
		</style>
		<oo-atoms-button
			data-state$='${progress ? 'progress' : ''}'
			on-clicked='${() => this.signOut()}'>Signing out</oo-atoms-button>
		`
	}

	render(progress: boolean = false) {
		render(this.html(progress), this)
	}

	async signOut() {
		this.render(true)
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
		this.render(false)
	}
}
