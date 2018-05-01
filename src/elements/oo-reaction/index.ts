import { OOElement } from '../oo-element'
import { html } from '../../lib/html'
import weakMap from '../../lib/weak-map'
import { ReactionType } from '../../type/reaction-type'
import { asReactionType } from '../../lib/as'
import reactionClient from '../../lib/oo-api-client-reaction'

type Method = 'GET' | 'POST' | 'DELETE'

const ATTR = {
	DATA_UID: 'data-uid',
	DATA_TYPE: 'data-type'
}

const reaction = async (method: Method, uid: string, type: ReactionType) => {
	return reactionClient({ method, uid, reaction: type })
}

const stateUid = weakMap<string>()
const stateType = weakMap<ReactionType>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID, ATTR.DATA_TYPE]
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
		this.update()
	}

	render() {
		const uid = stateUid.get(this)
		const type = asReactionType(stateType.get(this))
		if (!uid) {
			return html``
		}
		return html`
		<style>
		</style>
		<button on-click='${async () =>
			this.postReaction(uid, type)
				.then()
				.catch()}'>+ upvote</button>
		<button on-click='${async () =>
			this.deleteReaction(uid, type)
				.then()
				.catch()}'>- upvote</button>
		`
	}

	async getReaction(uid: string, type: ReactionType) {
		const results = await reaction('GET', uid, type)
		console.log(results)
	}

	async postReaction(uid: string, type: ReactionType) {
		const results = await reaction('POST', uid, type)
		console.log(results)
	}

	async deleteReaction(uid: string, type: ReactionType) {
		const results = await reaction('DELETE', uid, type)
		console.log(results)
	}
}
