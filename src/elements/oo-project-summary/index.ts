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
import {currencyToSign} from '../../lib/get-price-per-hour'
import datetime from '../_atoms/oo-atoms-datetime'

define('oo-atoms-message', message)
define('oo-atoms-user-name', userName)
define('oo-atoms-datetime', datetime)

interface HTMLOptions {
	created: number,
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
const projectCreated: WeakMap<object, number> = new WeakMap()

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
		const {created, body, offerer, amount, currency} = opts
		const sign = currencyToSign(currency)
		const lines = lineBreak(body)
		return html`
		<style>
			@import '../../style/_vars-font-family.css';
			@import '../../style/_mixin-heading.css';
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
			h2 {
				@mixin heading;
				font-family: var(--font-family);
			}
			dl {
				margin: 0 0 1rem;
				font-family: var(--font-family);
				display: flex;
				flex-wrap: wrap;
				font-size: 0.9rem;
				dt {
					width: 30%;
					margin-bottom: 0.2rem;
					font-weight: 300;
				}
				dd {
					margin: 0;
					width: 70%;
				}
			}
			.amount {
				text-transform: uppercase;
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
			<h2>About this offer</h2>
			<dl>
				<dt>Offer date</dt>
				<dd class=date><oo-atoms-datetime data-unixtime$='${created}'></oo-atoms-datetime></dd>
				<dt>Offer amount</dt>
				<dd class=amount>${currency} ${sign}${amount}</dd>
			</dl>
		</main>
		`
	}

	render() {
		render(this.html({
			created: projectCreated.get(this),
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
			const [project] = response
			projectCreated.set(this, project.created)
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
