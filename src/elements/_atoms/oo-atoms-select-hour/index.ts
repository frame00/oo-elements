import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../../lib/render'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
	target: T
}

const EVENT = {
	CHANGE_HOUR: detail => new CustomEvent('changehour', {detail})
}

const hour: WeakMap<object, number> = new WeakMap()

export default class extends HTMLElement {
	get hour() {
		return hour.get(this)
	}

	constructor() {
		super()
		hour.set(this, 1)
		this.render()
	}

	html(h: number) {
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
				${repeat([1, 2, 3], item => html`
				<li>
					<button class$=${item === h ? 'active' : ''} on-click='${e => this.onButtonClick(e)}'>${item}</button>
				</li>`)}
				<li>
					<input type=number name=hour min=0 step=1 value$='${h}' on-focus='${e => this.onHourChange(e)}' on-change='${e => this.onHourChange(e)}'></input>
				</li>
			</ul>
		</from>
		`
	}

	render() {
		render(this.html(this.hour), this)
	}

	onButtonClick(e: HTMLElementEvent<HTMLButtonElement>) {
		const {textContent} = e.target
		const int = ~~textContent
		hour.set(this, int)
		this.render()
		this.dispatch()
	}

	onHourChange(e: HTMLElementEvent<HTMLInputElement>) {
		const {value} = e.target
		const int = ~~value
		e.target.value = `${int}`
		hour.set(this, int)
		this.render()
		this.dispatch()
	}

	dispatch() {
		this.dispatchEvent(EVENT.CHANGE_HOUR(this.hour))
	}
}
