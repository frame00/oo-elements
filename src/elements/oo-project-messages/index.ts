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
	DATA_UID: 'data-uid'
}

const projectUid: WeakMap<object, string> = new WeakMap()
const messages: WeakMap<object, MapedOOMessages> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		messages.set(this, [])
		this.fetchMessages(projectUid.get(this))
	}

	html(mess: MapedOOMessages) {
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
			const author = lineBreak(mes.ext.get('author'))
			return html`
			<oo-atoms-message data-tooltip-position=left>
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
		render(this.html(messages.get(this)), this)
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
