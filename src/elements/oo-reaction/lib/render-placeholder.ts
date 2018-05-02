import { html, render } from '../../../lib/html'
import style from './style'
import OOReaction from '..'

export default (el: OOReaction) => {
	const template = () => {
		return html`
		${style()}
		<style>
			@import '../../../style/_mixin-button-progress.css';
			span {
				display: block;
				height: 2rem;
				border-radius: 10px;
				margin-top: 0.2rem;
				@mixin progress;
			}
			button {
				@mixin progress;
				border: 0;
				&::before {
					content: '🍣';
					visibility: hidden;
				}
			}
			[aria-hidden=true] {
				visibility: hidden;
			}
		</style>
		<label aria-busy=true>
			<button disabled>
				<span aria-hidden=true>.</span>
			</button>
			<span></span>
		</label>
		`
	}
	render(template(), el)
}
