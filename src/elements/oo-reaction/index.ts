import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import { ReactionType } from '../../type/reaction-type'
import { asReactionType } from '../../lib/as'
import reactionClient from '../../lib/oo-api-client-reaction'
import getUserReaction from '../../lib/oo-api-get-user-projects-reactions'
import weakMap from '../../lib/weak-map'
import store from '../../lib/local-storage'

type Method = 'GET' | 'POST' | 'DELETE'

const ATTR = {
	DATA_UID: 'data-uid',
	DATA_TYPE: 'data-type'
}

const stateUid = weakMap<string>()
const stateType = weakMap<ReactionType>()
const stateCount = weakMap<number>()
const stateReacted = weakMap<boolean>()

const reaction = async (method: Method, uid: string, type: ReactionType) => {
	return reactionClient({ method, uid, reaction: type })
}
const changeReaction = async (el: OOReaction, add: boolean) => {
	const results = await reaction(add ? 'POST' : 'DELETE', el.uid, el.type)
	console.log(results)
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
		return [ATTR.DATA_UID, ATTR.DATA_TYPE]
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
			default:
		}
		if (!this.connected) {
			return
		}
		this.getReaction()
			.then()
			.catch()
	}

	connectedCallback() {
		super.connectedCallback(false)
		if (!this.uid || !this.type) {
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
		const loggedIn = Boolean(store.uid)
		if (!uid) {
			return html``
		}
		const clickHandler = reacted
			? async () => this.deleteReaction()
			: async () => this.postReaction()

		return html`
		<style>
		</style>
		<button class$='${type}'
				on-click='${async () =>
					clickHandler()
						.then()
						.catch()}'
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
