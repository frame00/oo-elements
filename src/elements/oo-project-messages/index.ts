import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getProjectMessages from '../../lib/oo-api-get-project-messages'
import getMessage from '../../lib/oo-api-get-message'
import toMap from '../../lib/extensions-to-map'
import {OOMessage, MapedOOMessages} from '../../d/oo-message'
import define from '../../lib/define'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import ooButton from '../_atoms/oo-atoms-button'
import message from './lib/message'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', ooButton)

interface Options {
	iam: string,
	project: string,
	messages: MapedOOMessages,
	itemCount: number
}

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_UID: 'data-uid'
}

const iam: WeakMap<object, string> = new WeakMap()
const projectUid: WeakMap<object, string> = new WeakMap()
const messages: WeakMap<object, MapedOOMessages> = new WeakMap()
const itemCount: WeakMap<object, number> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID, ATTR.DATA_IAM]
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
				break
			case ATTR.DATA_IAM:
				iam.set(this, next)
				break
			default:
				break
		}
		this.fetchMessages(projectUid.get(this))
	}

	html(opts: Options) {
		const {iam: user, messages: mess, project, itemCount: count} = opts
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
			itemCount: itemCount.get(this)
		}
		render(this.html(opts), this)
	}

	async fetchMessages(uid: string, time?: number) {
		if (typeof uid !== 'string') {
			return
		}
		const api = await getProjectMessages(uid, time)
		const {response, headers} = api
		itemCount.set(this, Number(headers.get('x-oo-item-count')))
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
