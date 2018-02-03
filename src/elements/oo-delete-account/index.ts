import {html} from 'lit-html'
import render from '../../lib/render'
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

	html() {
		return html`
		<style>
		</style>
		<oo-atoms-button on-clicked='${() => this.deleteAccount()}'>Delete your account</oo-atoms-button>
		`
	}

	render() {
		render(this.html(), this)
	}

	async deleteAccount() {
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
	}
}
