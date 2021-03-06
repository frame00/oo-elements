import { OOElement } from '../oo-element'
import { html } from '../../lib/html'

export default class extends OOElement {
	render() {
		return html`
		<style>
			@import '../../style/_vars-color-yellow.css';
			@import '../../style/_vars-font-family.css';
			:host {
				display: block;
			}
			footer {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
			}
			::slotted(a) {
				margin: 0 1rem;
				padding: 1rem 0;
				text-decoration: none;
				color: color(var(--yellow) blend(red 20%));
				font-size: 0.8rem;
				font-family: var(--font-family);
			}
		</style>
		<footer>
			<slot name=item></slot>
		</footer>
		`
	}
}
