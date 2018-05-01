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

const reaction = async (method: Method, uid: string, type: ReactionType) => {
	return reactionClient({ method, uid, reaction: type })
}

const stateUid = weakMap<string>()
const stateType = weakMap<ReactionType>()
const stateCount = weakMap<number>()
const stateReacted = weakMap<boolean>()

export default class extends OOElement {
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
		this.update()
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
		<div class$='${type}'>
			<button on-click='${async () =>
				clickHandler()
					.then()
					.catch()}'
					disabled?='${!loggedIn}'>upvote</button>
		</div>
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
		const results = await reaction('POST', this.uid, this.type)
		console.log(results)
	}

	async deleteReaction() {
		const results = await reaction('DELETE', this.uid, this.type)
		console.log(results)
	}
}
