import {repeat} from 'lit-html/lib/repeat'
import {html, render} from '../../../lib/html'
import weakMap from '../../../lib/weak-map'
import {Scope} from '../../../type/scope'
import {ChangeScopeDetail, ChangeScope} from '../../../type/event'
import {Currency} from '../../../type/currency'
import getCurrency from '../../../lib/get-currency'
import getInitPrice from '../../../lib/get-init-price'
import {currencyToSign} from '../../../lib/get-price-per-hour'

const EVENT = {
	CHANGE_SCOPE: (detail: ChangeScopeDetail): ChangeScope => new CustomEvent('changescope', {detail})
}

const stateScope = weakMap<Scope>()
const stateCurrency = weakMap<Currency>()

export default class extends HTMLElement {
	get scope() {
		return stateScope.get(this)
	}

	constructor() {
		super()
		stateScope.set(this, 'public')
		stateCurrency.set(this, getCurrency())
		this.render()
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
		render(this.html(this.scope, stateCurrency.get(this)), this)
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
