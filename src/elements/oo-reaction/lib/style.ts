import { html } from '../../../lib/html'

export default () => html`
	<style>
		@import '../../../style/_mixin-button.css';
		@import '../../../style/_vars-font-family.css';
		:host {
			display: inline-flex;
		}
		label {
			display: inline-block;
			text-transform: capitalize;
			font-size: 1rem;
			text-align: center;
			cursor: pointer;
			font-family: var(--font-family);
		}
		button {
			@mixin button;
			display: block;
			&::after {
				content: '';
			}
			&::before {
				content: '';
				display: block;
				font-size: 1.6rem;
			}
			&.upvote {
				&::before {
					content: '👍';
				}
			}
			&.join {
				&::before {
					content: '👨‍👩‍👧‍👦';
				}
			}
			&.sponsor {
				&::before {
					content: '👼';
				}
			}
		}
	</style>
`
