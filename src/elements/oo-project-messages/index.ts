import OOElement from '../../lib/classes/oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../lib/html'
import getProjectMessages from '../../lib/oo-api-get-project-messages'
import getMessage from '../../lib/oo-api-get-message'
import toMap from '../../lib/extensions-to-map'
import {OOMessage, MapedOOMessages} from '../../type/oo-message'
import define from '../../lib/define'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import ooButton from '../_atoms/oo-atoms-button'
import message from './lib/message'
import weakMap from '../../lib/weak-map'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', ooButton)

interface Options {
	iam: string,
	project: string,
	messages: MapedOOMessages,
	itemCount: number,
	limit: number
}

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
		switch(attr) {
			case ATTR.DATA_UID:
				projectUid.set(this, next)
				messages.set(this, [])
				if (this.connected) {
					this.fetchMessages(projectUid.get(this))
				}
				return
			case ATTR.DATA_IAM:
				iam.set(this, next)
				break
			case ATTR.DATA_LIMIT:
				stateLimit.set(this, ~~next)
				break
			default:
				break
		}
		if (this.connected) {
			this.render()
		}
	}

	connectedCallback() {
		super.connectedCallback(false)
		this.fetchMessages(projectUid.get(this))
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	html(opts: Options) {
		const {iam: user, messages: mess, project, itemCount: count} = opts
		if (mess.length === 0) {
			return html``
		}
		const paging = mess[0].created - 1
		const more = count > mess.length ? html`
		<div class=paging>
			<oo-atoms-button on-clicked='${() => this.fetchMessages(project, paging)}'>More</oo-atoms-button>
		</div>
		` : html``

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

	render() {
		const opts = {
			iam: iam.get(this),
			project: projectUid.get(this),
			messages: messages.get(this),
			itemCount: itemCount.get(this),
			limit: stateLimit.get(this)
		}
		render(this.html(opts), this)
	}

	async fetchMessages(uid: string, time?: number) {
		if (typeof uid !== 'string') {
			return
		}
		const limit = stateLimit.get(this)
		if (limit === undefined && this.hasAttribute(ATTR.DATA_LIMIT)) {
			return
		}
		const api = await getProjectMessages(uid, time, {limit})
		const {response, headers} = api
		itemCount.set(this, Number(headers.get('x-oo-count')))
		if (Array.isArray(response)) {
			const items = this.mapMessages(response)
			messages.set(this, this.mergeMessages(items.reverse()))
		}
		this.render()
	}

	mapMessages(mess: Array<OOMessage>): MapedOOMessages {
		const items: MapedOOMessages = []
		for(const i of mess) {
			const item = {
				ext: toMap(i)
			}
			items.push({...i, ...item})
		}
		return items
	}

	mergeMessages(mess: MapedOOMessages, direction: 'before' | 'after' = 'before'): MapedOOMessages {
		const origin = messages.get(this)
		if (direction === 'before') {
			return [...mess, ...origin]
		}
		return [...origin, ...mess]
	}

	public async injectMessages(ids: Array<string>) {
		const mess = await Promise.all(ids.map(id => getMessage(id)))
		let items: MapedOOMessages = []
		for(const mes of mess) {
			const {response} = mes
			if (Array.isArray(response)) {
				const item = this.mapMessages(response)
				items = [...items, ...item]
			}
		}
		if (items.length > 0) {
			messages.set(this, this.mergeMessages(items, 'after'))
			this.render()
		}
	}
}
