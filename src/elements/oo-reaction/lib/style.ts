import { html } from '../../../lib/html'

export default () => html`
	<style>
		@import '../../../style/_mixin-button.css';
		button {
			@mixin button;
		}
	</style>
`
