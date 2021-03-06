import { OOElement } from '../oo-element'
import { repeat } from 'lit-html/lib/repeat'
import { html } from '../../lib/html'
import getProjectMessages from '../../lib/oo-api-get-project-messages'
import getMessage from '../../lib/oo-api-get-message'
import toMap from '../../lib/extensions-to-map'
import { OOMessage, MapedOOMessages } from '../../type/oo-message'
import define from '../../lib/define'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import ooButton from '../_atoms/oo-atoms-button'
import message from './lib/message'
import weakMap from '../../lib/weak-map'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', ooButton)

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_UID: 'data-uid',
	DATA_LIMIT: 'data-limit'
}

const iam = weakMap<string>()
const projectUid = weakMap<string>()
const messages = weakMap<MapedOOMessages>()
const itemCount = weakMap<number>()
const stateLimit = weakMap<number>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID, ATTR.DATA_IAM, ATTR.DATA_LIMIT]
	}

	constructor() {
		super()
		messages.set(this, [])
	}

	get messages() {
		return messages.get(this)
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		switch (attr) {
			case ATTR.DATA_UID:
				projectUid.set(this, next)
				messages.set(this, [])
				if (this.connected) {
					this.fetchMessages(projectUid.get(this))
						.then()
						.catch()
				}
				return
			case ATTR.DATA_IAM:
				iam.set(this, next)
				break
			case ATTR.DATA_LIMIT:
				stateLimit.set(this, ~~next)
				break
			default:
		}
		if (this.connected) {
			this.update()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
		this.fetchMessages(projectUid.get(this))
			.then()
			.catch()
	}

	render() {
		const { user, mess, project, count } = {
			user: iam.get(this),
			project: projectUid.get(this),
			mess: messages.get(this),
			count: itemCount.get(this)
		}
		if (mess.length === 0) {
			return html``
		}
		const paging = mess[0].created - 1
		const more =
			count > mess.length
				? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${async () =>
				this.fetchMessages(project, paging)
					.then()
					.catch()}'>More</oo-atoms-button>
		</div>
		`
				: html``

		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			section {
				padding: 1rem;
				marign-bottom: 0.5rem;
				font-family: var(--font-family);
				background: #ECEFF1;
			}
			.paging {
				margin-bottom: 2rem;
				text-align: center;
			}
			p {
				margin: 0;
			}
			p:not(:last-child) {
				margin-bottom: 1rem;
			}
			[slot=body] {
				padding: 1rem;
			}
			[data-tooltip-position] {
				width: 80%;
			}
			[data-tooltip-position=right] {
				margin-left: 20%;
			}
		</style>
		${more}
		${repeat(mess, mes => message(user, mes))}
		`
	}

	async fetchMessages(uid: string, time?: number) {
		if (typeof uid !== 'string') {
			return
		}
		const limit = stateLimit.get(this)
		if (limit === undefined && this.hasAttribute(ATTR.DATA_LIMIT)) {
			return
		}
		const api = await getProjectMessages(uid, time, { limit })
		const { response, headers } = api
		itemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const items = this.mapMessages(response)
			messages.set(this, this.mergeMessages(items.reverse()))
		}
		this.update()
	}

	mapMessages(mess: OOMessage[]): MapedOOMessages {
		const items: MapedOOMessages = []
		for (const i of mess) {
			const item = {
				ext: toMap(i)
			}
			items.push({ ...i, ...item })
		}
		return items
	}

	mergeMessages(
		mess: MapedOOMessages,
		direction: 'before' | 'after' = 'before'
	): MapedOOMessages {
		const origin = messages.get(this)
		if (direction === 'before') {
			return [...mess, ...origin]
		}
		return [...origin, ...mess]
	}

	public async injectMessages(ids: string[]) {
		const mess = await Promise.all(ids.map(async id => getMessage(id)))
		let items: MapedOOMessages = []
		for (const mes of mess) {
			const { response } = mes
			if (Array.isArray(response)) {
				const item = this.mapMessages(response)
				items = [...items, ...item]
			}
		}
		if (items.length > 0) {
			messages.set(this, this.mergeMessages(items, 'after'))
			this.update()
		}
	}
}
