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
import lineBreak from '../../lib/line-break'

define('oo-atoms-message', ooMessage)
define('oo-atoms-user-name', ooUserName)

interface MapedOOMessage extends OOMessage {
	ext: OOExtensionMap
}
type MapedOOMessages = Array<MapedOOMessage>

const ATTR = {
	DATA_IAM: 'data-iam',
	DATA_UID: 'data-uid'
}

const iam: WeakMap<object, string> = new WeakMap()
const projectUid: WeakMap<object, string> = new WeakMap()
const messages: WeakMap<object, MapedOOMessages> = new WeakMap()

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

	html(user: string, mess: MapedOOMessages) {
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
		</style>
		${repeat(mess, mes => {
			const lines = lineBreak(mes.ext.get('body'))
			const author = mes.ext.get('author')
			const position = author === user ? 'right' : 'left'
			return html`
			<oo-atoms-message data-tooltip-position$='${position}'>
				<section slot=body>
					${repeat(lines, line => html`<p>${line}</p>`)}
				</section>
				<footer slot=footer>
					<oo-atoms-user-name data-iam$='${author}' data-size=small></oo-atoms-user-name>
				</footer>
			</oo-atoms-message>
			`
		})}
		`
	}

	render() {
		render(this.html(iam.get(this), messages.get(this)), this)
	}

	async fetchMessages(uid: string, time?: number) {
		const api = await getMessages(uid, time)
		const {response} = api
		if (Array.isArray(response)) {
			const items: MapedOOMessages = []
			for(const i of response) {
				const item = {
					ext: toMap(i)
				}
				items.push({...i, ...item})
			}
			messages.set(this, [...messages.get(this), ...items])
		}
		this.render()
	}
}
