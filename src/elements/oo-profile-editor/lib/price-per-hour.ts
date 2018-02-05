import {TemplateResult} from 'lit-html'
import {html} from '../../../lib/html'
import {ExtensionPricePerHour} from '../../../type/extension-price-per-hour'
import {Usd, Jpy} from '../../../type/currency'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}
interface Callbacks {
	usd?: (e: HTMLElementEvent<HTMLInputElement>, currency: Usd) => void,
	jpy?: (e: HTMLElementEvent<HTMLInputElement>, currency: Jpy) => void
}

export default (pricePerHour: ExtensionPricePerHour, callbacks: Callbacks): TemplateResult => {
	const {usd = 100, jpy = 10000} = pricePerHour || {}
	return html`
	<p>USD</p>
	<input name=usd type=number step=0.01 min=5 value$='${usd}' on-change='${e => callbacks.usd(e, 'usd')}'></input>
	<p>JPY</p>
	<input name=jpy type=number step=1 min=500 value$='${jpy}' on-change='${e => callbacks.jpy(e, 'jpy')}'></input>
	`
}
