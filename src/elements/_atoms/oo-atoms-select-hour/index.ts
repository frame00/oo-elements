import {html} from 'lit-html'
import {repeat} from 'lit-html/lib/repeat'
import render from '../../../lib/render'
import {Hour} from '../../../type/hour'

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
		const values: Array<Hour> = [1, 2, 3, 'pend']
		return html`
		<style>
			@import '../../../style/_reset-button.css';
			@import '../../../style/_mixin-heading.css';
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
					width: calc(100% / 4);
					display: flex;
					justify-content: center;
					border-left: 1px solid whitesmoke;
					&:first-child {
						border: 0;
					}
				}
			}
			button {
				width: 100%;
				height: 4rem;
				font-size: 1.2rem;
				font-weight: 400;
				font-family: var(--font-family);
			}
			.active {
				button {
					font-weight: 700;
					background: var(--yellow);
					color: black;
				}
				&,
				+ li {
					border: 0;
				}
			}
			.heading {
				@mixin heading;
			}
		</style>
		<div class=heading>Hours?</div>
		<from>
			<ul>
				${repeat(values, item => html`
				<li class$=${item === h ? 'active' : ''}>
					<button data-hour$=${item} on-click='${() => this.onButtonClick(item)}'>
						${item === 'pend' ? 'TBD' : item}
					</button>
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
