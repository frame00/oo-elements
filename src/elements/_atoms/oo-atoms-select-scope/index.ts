import OOElement from '../../../lib/classes/oo-element'
import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../../lib/html'
import weakMap from '../../../lib/weak-map'
import {Scope} from '../../../type/scope'
import {ChangeScopeDetail, ChangeScope} from '../../../type/event'
import {Currency} from '../../../type/currency'
import getCurrency from '../../../lib/get-currency'
import getInitPrice from '../../../lib/get-init-price'
import {currencyToSign} from '../../../lib/get-price-per-hour'
import customEvent from '../../../lib/custom-event'

const ATTR = {
	DATA_SCOPE: 'data-scope',
	DATA_CURRENCY: 'data-currency'
}
const EVENT = {
	CHANGE_SCOPE: (detail: ChangeScopeDetail): ChangeScope => customEvent('changescope', detail)
}
const asScope = (d: string): Scope => {
	if (d === 'public' || d === 'private') {
		return d
	}
	return 'public'
}
const asCurrency = (d: string): Currency => {
	if (d === 'usd' || d === 'jpy') {
		return d
	}
	return getCurrency()
}

const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_SCOPE, ATTR.DATA_CURRENCY]
	}

	get scope() {
		return stateScope.get(this)
	}

	get currency() {
		return stateCurrency.get(this)
	}

	constructor() {
		super()
		stateScope.set(this, asScope(this.getAttribute(ATTR.DATA_SCOPE)))
		stateCurrency.set(this, asCurrency(this.getAttribute(ATTR.DATA_CURRENCY)))
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next || !next) {
			return
		}
		switch(attr) {
			case ATTR.DATA_SCOPE:
				stateScope.set(this, asScope(next))
				break
			case ATTR.DATA_CURRENCY:
				stateCurrency.set(this, asCurrency(next))
				break
			default:
				break
		}
		if (this.connected) {
			this.render()
		}
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	html(scope: Scope, currency: Currency) {
		const values: Array<Scope> = ['public', 'private']
		const price = (() => {
			const sign = currencyToSign(currency)
			const amount = getInitPrice(currency)
			return `${sign}${amount.amount}`
		})()

		return html`
		<style>
			@import '../../../style/_reset-button.css';
			@import '../../../style/_vars-font-family.css';
			@import '../../../style/_vars-color-yellow.css';
			:host {
				display: block;
			}
			ul {
				margin: 0;
				padding: 0;
				display: flex;
				list-style: none;
				justify-content: space-around;
				li {
					width: 50%;
					display: flex;
					justify-content: center;
				}
			}
			button {
				width: 100%;
				height: 4rem;
				font-size: 1.2rem;
				font-weight: 400;
				text-transform: capitalize;
				font-family: var(--font-family);
				background: #f1eedf;
			}
			.active {
				button {
					font-weight: 700;
					background: var(--yellow);
					color: black;
				}
			}
		</style>
		<from>
			<ul>
				${repeat(values, item => html`
				<li class$=${item === scope ? 'active' : ''}>
					<button data-scope$='${item}' on-click='${() => this.onButtonClick(item)}'>
						${item}${item === 'private' ? ` (${price})` : ''}
					</button>
				</li>`)}
			</ul>
		</from>
		`
	}

	render() {
		render(this.html(this.scope, this.currency), this)
	}

	onButtonClick(item: Scope) {
		stateScope.set(this, item)
		this.render()
		this.dispatch()
	}

	dispatch() {
		this.dispatchEvent(EVENT.CHANGE_SCOPE({
			scope: this.scope,
			currency: stateCurrency.get(this)
		}))
	}
}
