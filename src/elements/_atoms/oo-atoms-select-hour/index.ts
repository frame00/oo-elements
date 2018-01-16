import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../../lib/render'

type Hour = number | string

const EVENT = {
	CHANGE_HOUR: detail => new CustomEvent('changehour', {detail})
}

const hour: WeakMap<object, Hour> = new WeakMap()

export default class extends HTMLElement {
	get hour() {
		return hour.get(this)
	}

	constructor() {
		super()
		hour.set(this, 1)
		this.render()
	}

	html(h: Hour) {
		return html`
		<style>
			@import '../../../style/_reset-button.css';
			:host {
				display: block;
			}
			button {
				&.active {
					background: red;
				}
			}
		</style>
		<from>
			<ul>
				${repeat([1, 2, 3, 'pend'], item => html`
				<li>
					<button class$=${item === h ? 'active' : ''} on-click='${() => this.onButtonClick(item)}'>${item}</button>
				</li>`)}
			</ul>
		</from>
		`
	}

	render() {
		render(this.html(this.hour), this)
	}

	onButtonClick(item: Hour) {
		const h = item === 'pend' ? item : ~~item
		hour.set(this, h)
		this.render()
		this.dispatch()
	}

	dispatch() {
		this.dispatchEvent(EVENT.CHANGE_HOUR(this.hour))
	}
}
