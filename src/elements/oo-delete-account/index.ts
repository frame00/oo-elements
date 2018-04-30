import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import define from '../../lib/define'
import button from '../_atoms/oo-atoms-button'
import { attach, dispatch } from '../../lib/notification'
import store from '../../lib/local-storage'
import deleteUser from '../../lib/oo-api-delete-user'
import customEvent from '../../lib/custom-event'
import weakMap from '../../lib/weak-map'

define('oo-atoms-button', button)

const EVENT = {
	DELETED: customEvent('deleted')
}

const stateProgress = weakMap<boolean>()

export default class extends OOElement {
	constructor() {
		super()
		attach()
		const { uid } = store
		if (typeof uid === 'string' && uid !== '') {
			this.update()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const progress = stateProgress.get(this)
		return html`
		<style>
		</style>
		<oo-atoms-button
			data-state$='${progress ? 'progress' : ''}'
			on-clicked='${async () =>
				this.deleteAccount()
					.then()
					.catch()}'>Delete your account</oo-atoms-button>
		`
	}

	async deleteAccount() {
		stateProgress.set(this, true)
		this.update()
		const { uid } = store
		const del = await deleteUser(uid)
		const { response } = del
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
		stateProgress.delete(this)
		this.update()
	}
}
