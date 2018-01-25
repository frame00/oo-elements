import {html} from 'lit-html'
import render from '../../../lib/render'
import weakMap from '../../../lib/weak-map'
import {Currency} from '../../../d/currency'
import ooMessage from '../../_atoms/oo-atoms-message'
import button from '../../_atoms/oo-atoms-button'
import define from '../../../lib/define'
import toMap from '../../../lib/extensions-to-map'
import store from '../../../lib/local-storage'
import getProject from '../../../lib/oo-api-get-project'
import patchProject from '../../../lib/oo-api-patch-project'
import success from '../../../lib/is-api-success'

define('oo-atoms-message', ooMessage)
define('oo-atoms-button', button)

const ATTR = {
	DATA_PROJECT_UID: 'data-project-uid'
}

const stateUid = weakMap<string>()
const stateProjectUid = weakMap<string>()
const statePermission = weakMap<boolean>()
const stateOfferer = weakMap<string>()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROJECT_UID]
	}

	constructor() {
		super()
		stateUid.set(this, store.uid)
	}

	attributeChangedCallback(attr, prev, next: string) {
		if (prev === next && !next) {
			return
		}
		stateProjectUid.set(this, next)
		this.fetchProject(next)
	}

	html(uid: string, offerer: string, perm: boolean) {
		const header = () => {
			if (perm === true) {
				return 'Accepted'
			} else if (perm === false) {
				return 'Rejected'
			} else if (uid === offerer) {
				return 'Waiting for your answer'
			}
			return 'You are waiting for a reply.'
		}

		return html`
		<style>
		</style>
		<oo-atoms-message data-tooltip-position=center>
			<section slot=body>
				<article class$='${perm ? 'accepted' : 'rejected'}'>
					<header>${header()}</header>
					${(() => {
						if (uid !== offerer && perm !== undefined) {
							return html``
						}
						if (uid === offerer && perm !== undefined) {
							return html`<p>Waiting for vendor's answer.</p>`
						}
						return html`
						<div class=buttons>
							<oo-atoms-button on-clicked='${() => this.projectPermission(false)}' data-block=enabled>Reject</oo-atoms-button>
							<oo-atoms-button on-clicked='${() => this.projectPermission(true)}' data-block=enabled>Accept</oo-atoms-button>
						</div>
						`
					})()}
				</article>
			</section>
		</oo-atoms-message>
		`
	}

	render() {
		render(this.html(stateUid.get(this), stateOfferer.get(this), statePermission.get(this)), this)
	}

	async projectPermission(ans: boolean) {
		if (ans === undefined) {
			return
		}
		const result = await patchProject({
			offer_permission: Boolean(ans)
		})
		const {status} = result
		if (success(status)) {
			statePermission.set(this, ans)
		}
		this.render()
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			statePermission.set(this, mapedExtensions.get('offer_permission'))
		}
		this.render()
	}
}
