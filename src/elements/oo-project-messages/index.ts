import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getMessages from '../../lib/oo-api-get-project-messages'
import toMap from '../../lib/extensions-to-map'
import {OOExtensionMap} from '../../d/oo-extension'
import {OOMessage} from '../../d/oo-message'
import define from '../../lib/define'
import ooMessage from '../_atoms/oo-atoms-message'
import ooUserName from '../_atoms/oo-atoms-user-name'
import ooButton from '../_atoms/oo-atoms-button'
import lineBreak from '../../lib/line-break'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)
define('oo-atoms-button', ooButton)

interface MapedOOMessage extends OOMessage {
	ext: OOExtensionMap
}
type MapedOOMessages = Array<MapedOOMessage>
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

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
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
			<oo-atoms-button on-click='${() => this.fetchMessages(project, paging)}'>More</oo-atoms-button>
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
		${repeat(mess, mes => {
			const lines = lineBreak(mes.ext.get('body'))
			const author = mes.ext.get('author')
			const position = author === user ? 'right' : 'left'
			const footer = author === user ? html`` :
				html`
				<footer slot=footer>
					<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
				</footer>`
			return html`
			<oo-atoms-message data-tooltip-position$='${position}'>
				<section slot=body>
					${repeat(lines, line => html`<p>${line}</p>`)}
				</section>
				${footer}
			</oo-atoms-message>
			`
		})}
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
		const api = await getMessages(uid, time)
		const {response, headers} = api
		itemCount.set(this, Number(headers.get('x-oo-item-count')))
		if (Array.isArray(response)) {
			const items: MapedOOMessages = []
			for(const i of response) {
				const item = {
					ext: toMap(i)
				}
				items.push({...i, ...item})
			}
			messages.set(this, [...items.reverse(), ...messages.get(this)])
		}
		this.render()
	}
}
