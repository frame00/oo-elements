import {html, render} from '../../lib/html'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import {attach, dispatch} from '../../lib/notification'
import store from '../../lib/local-storage'
import deleteUser from '../../lib/oo-api-delete-user'

define('oo-atoms-button', button)

const EVENT = {
	DELETED: new Event('deleted')
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
			on-clicked='${() => this.deleteAccount()}'>Delete your account</oo-atoms-button>
		`
	}

	render(progress: boolean = false) {
		render(this.html(progress), this)
	}

	async deleteAccount() {
		this.render(true)
		const {uid} = store
		const del = await deleteUser(uid)
		const {response} = del
		if (Array.isArray(response)) {
			store.clear()
			dispatch({
				message: 'See you again'
			})
			this.dispatchEvent(EVENT.DELETED)
		} else {
			dispatch({
				message: 'Failed to delete account',
				type: 'error'
			})
		}
		this.render(false)
	}
}
