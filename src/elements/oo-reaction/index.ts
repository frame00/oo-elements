import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import { ReactionType } from '../../type/reaction-type'
import { asReactionType } from '../../lib/as'
import reactionClient from '../../lib/oo-api-client-reaction'
import getUserReaction from '../../lib/oo-api-get-user-projects-reactions'
import weakMap from '../../lib/weak-map'
import store from '../../lib/local-storage'
import templateForSponsor from './lib/template-sponsor'
import style from './lib/style'

type Method = 'GET' | 'POST' | 'DELETE'

const ATTR = {
	DATA_UID: 'data-uid',
	DATA_TYPE: 'data-type',
	MOCK_FEATURE: 'mock-feature'
}
const MOCK_FEATURE = 'sponsor'

const stateUid = weakMap<string>()
const stateType = weakMap<ReactionType>()
const stateCount = weakMap<number>()
const stateReacted = weakMap<boolean>()
const stateInProgress = weakMap<boolean>()
const stateMockFeature = weakMap<'sponsor'>()

const reaction = async (method: Method, uid: string, type: ReactionType) => {
	return reactionClient({ method, uid, reaction: type })
}
const changeReaction = async (el: OOReaction, add: boolean) => {
	const results = await reaction(add ? 'POST' : 'DELETE', el.uid, el.type)
	stateInProgress.delete(el)
	const { response } = results
	if (!Array.isArray(response)) {
		return
	}
	const [succeed] = response
	if (!succeed) {
		return
	}
	stateReacted.set(el, add)
	stateCount.set(el, el.count + (add ? 1 : -1))
}

class OOReaction extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID, ATTR.DATA_TYPE, ATTR.MOCK_FEATURE]
	}

	get uid() {
		return stateUid.get(this)
	}

	get type() {
		return stateType.get(this)
	}

	get count() {
		return stateCount.get(this)
	}

	get reacted() {
		return stateReacted.get(this)
	}

	get isMock() {
		return Boolean(stateMockFeature.get(this))
	}

	get isInProgress() {
		return stateInProgress.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_UID:
				stateUid.set(this, next)
				break
			case ATTR.DATA_TYPE:
				stateType.set(this, asReactionType(next))
				break
			case ATTR.MOCK_FEATURE:
				if (next === MOCK_FEATURE) {
					stateMockFeature.set(this, MOCK_FEATURE)
				}
				break
			default:
		}
		if (!this.connected) {
			return
		}
		if (this.isMock) {
			return templateForSponsor(this)
		}
		this.getReaction()
			.then()
			.catch()
	}

	connectedCallback() {
		super.connectedCallback(false)
		if (!this.uid || !this.type || this.isMock) {
			return
		}
		this.getReaction()
			.then()
			.catch()
	}

	render() {
		const uid = this.uid
		const type = this.type
		const reacted = this.reacted
		const count = this.count
		const progress = this.isInProgress
		const loggedIn = Boolean(store.uid)
		if (!uid) {
			return html``
		}
		const clickHandler = reacted
			? async () => this.deleteReaction()
			: async () => this.postReaction()

		return html`
		${style()}
		<button class$='${type} ${progress ? 'progress' : ''}'
				on-click='${async () => {
					stateInProgress.set(this, true)
					this.update()
					await clickHandler()
				}}'
				disabled?='${!loggedIn}'>${count}</button>
		`
	}

	async getReaction() {
		const results = await Promise.all([
			reaction('GET', this.uid, this.type),
			getUserReaction(this.uid, this.type)
		])
		const [reacts, reacted] = results
		const { response, headers } = reacts
		if (!Array.isArray(response)) {
			return
		}
		stateReacted.set(this, reacted ? reacted.response[0] : false)
		stateCount.set(this, Number(headers.get('x-oo-count')))
		this.update()
	}

	async postReaction() {
		await changeReaction(this, true)
		this.update()
	}

	async deleteReaction() {
		await changeReaction(this, false)
		this.update()
	}
}

export default OOReaction
