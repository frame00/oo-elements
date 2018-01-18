import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../lib/render'
import getProject from '../../lib/oo-api-get-project'
import toMap from '../../lib/extensions-to-map'
import {Currency} from '../../d/currency'
import define from '../../lib/define'
import message from '../_atoms/oo-atoms-message'
import userName from '../_atoms/oo-atoms-user-name'
import lineBreak from '../../lib/line-break'

define('oo-atoms-message', message)
define('oo-atoms-user-name', userName)

interface HTMLOptions {
	body: string,
	offerer: string,
	amount: string,
	currency: Currency
}

const ATTR = {
	DATA_UID: 'data-uid'
}
const EVENT = {
	PROJECT_UPDATED: new Event('projectupdated')
}

const projectUid: WeakMap<object, string> = new WeakMap()
const projectBody: WeakMap<object, string> = new WeakMap()
const projectOfferer: WeakMap<object, string> = new WeakMap()
const projectOfferAmount: WeakMap<object, string> = new WeakMap()
const projectOfferCurrency: WeakMap<object, Currency> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_UID]
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		projectUid.set(this, next)
		this.fetchProject(projectUid.get(this))
	}

	html(opts: HTMLOptions) {
		const {body, offerer} = opts
		const lines = lineBreak(body)
		return html`
		<style>
			:host {
				display: block;
			}
			section {
				padding: 1.5rem;
				p {
					margin: 0;
					&:not(:last-child) {
						margin-bottom: 1rem;
					}
				}
			}
		</style>
		<main>
			<oo-atoms-message data-tooltip-position=left>
				<section slot=body>
					${repeat(lines, line => html`<p>${line}</p>`)}
				</section>
				<footer slot=footer>
					<oo-atoms-user-name data-iam$='${offerer}' data-size=small></oo-atoms-user-name>
				</footer>
			</oo-atoms-message>
		</main>
		`
	}

	render() {
		render(this.html({
			body: projectBody.get(this),
			offerer: projectOfferer.get(this),
			amount: projectOfferAmount.get(this),
			currency: projectOfferCurrency.get(this)
		}), this)
	}

	async fetchProject(uid: string) {
		const api = await getProject(uid)
		const {response} = api
		if (Array.isArray(response)) {
			const exts = toMap(response)
			projectBody.set(this, exts.get('body'))
			projectOfferer.set(this, exts.get('author'))
			projectOfferAmount.set(this, exts.get('offer_amount'))
			projectOfferCurrency.set(this, exts.get('offer_currency'))
		} else {
			projectBody.delete(this)
			projectOfferer.delete(this)
			projectOfferAmount.delete(this)
			projectOfferCurrency.delete(this)
		}
		this.render()
		this.dispatchEvent(EVENT.PROJECT_UPDATED)
	}
}
