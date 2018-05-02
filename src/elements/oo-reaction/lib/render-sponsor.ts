import { html, render } from '../../../lib/html'
import modal from '../../oo-modal'
import define from '../../../lib/define'
import OOReaction from '..'
import style from './style'

define('oo-modal', modal)

export default (el: OOReaction) => {
	const template = (open: boolean, handler: Function) => {
		return html`
		${style()}
		<style>
			@import '../../../style/_vars-font-family.css';

			[slot] {
				padding: 2rem;
			}
			oo-modal {
				font-family: var(--font-family);
			}
			header {
				background: #4CAF50;
				h1 {
					margin: auto;
				}
			}
			main {
				background: #8BC34A;
				p {
					margin: 1rem 0;
					&:first-child {
						margin-top: 0;
					}
					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		</style>
		<label aria-busy=false>
			<button class=sponsor on-click='${handler}'>-</button>
			sponsor
		</label>
		<oo-modal data-open$='${open ? 'enabled' : 'disabled'}' on-close='${handler}'>
			<header slot=header><h1>Become a sponsor</h1></header>
			<main slot=body>
				<p>This feature is currently in preparation.</p>
				<p>Contact support via <a href=mailto:support@frame00.com>email</a>(English or Japanese).</p>
			</main>
		</oo-modal>
		`
	}
	const update = (state: boolean) => () => {
		render(template(!state, update(!state)), el)
	}
	render(template(false, update(false)), el)
}
