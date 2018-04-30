import { OOElement } from '../../oo-element'
import { html } from '../../../lib/html'
import weakMap from '../../../lib/weak-map'
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
const stateapprove = weakMap<boolean>()
const stateOfferer = weakMap<string>()
const stateProgress = weakMap<boolean>()

export default class extends OOElement {
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

	connectedCallback() {
		super.connectedCallback(false)
	}

	render() {
		const uid = stateUid.get(this)
		const offerer = stateOfferer.get(this)
		const perm = stateapprove.get(this)
		const progress = stateProgress.get(this)
		const header = () => {
			if (perm === true) {
				return 'Accepted'
			} else if (perm === false) {
				return 'Rejected'
			} else if (uid !== offerer) {
				return 'Waiting for your answer'
			}
			return 'You are waiting for a reply.'
		}

		return html`
		<style>
			@import '../../../style/_vars-input.css';
			@import '../../../style/_vars-font-family.css';
			article {
				font-family: var(--font-family);
				> * {
					padding: 1rem;
				}
				&.accepted {
					background: var(--resolved-background);
					color: white;
				}
			}
			header {
				+ {
					border-top: 0.5px solid #00000036;
				}
			}
			.buttons {
				display: flex;
				> * {
					width: 50%;
				}
			}
		</style>
		<oo-atoms-message data-tooltip-position=center>
			<section slot=body>
				<article class$='${perm ? 'accepted' : 'rejected'}'>
					<header>${header()}</header>
					${(() => {
						if (perm !== undefined || uid === offerer) {
							return html``
						}
						return html`
						<div class=buttons>
							<oo-atoms-button on-clicked='${() =>
								this.projectApprove(false)}' data-block=enabled data-state$='${
							progress === false ? 'progress' : ''
						}'>Reject</oo-atoms-button>
							<oo-atoms-button on-clicked='${() =>
								this.projectApprove(true)}' data-block=enabled data-state$='${
							progress === true ? 'progress' : ''
						}'>Accept</oo-atoms-button>
						</div>
						`
					})()}
				</article>
			</section>
		</oo-atoms-message>
		`
	}

	async projectApprove(ans: boolean) {
		if (ans === undefined) {
			return
		}
		stateProgress.set(this, ans)
		this.update()
		const result = await patchProject({
			uid: stateProjectUid.get(this),
			approve: Boolean(ans)
		})
		const { status } = result
		if (success(status)) {
			stateapprove.set(this, ans)
		}
		stateProgress.delete(this)
		this.update()
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const { response } = api
		if (Array.isArray(response)) {
			const [item] = response
			const mapedExtensions = toMap(item)
			stateapprove.set(this, mapedExtensions.get('approve'))
			stateOfferer.set(this, mapedExtensions.get('author'))
		}
		this.update()
	}
}
