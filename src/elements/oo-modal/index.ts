import {html} from 'lit-html'
import render from '../../lib/render'

const ATTR = {
	DATA_OPEN: 'data-open'
}
const asBoolean = (data: string): boolean => {
	switch(data) {
		case 'enabled':
			return true
		case 'disabled':
			return false
		default:
			return false
	}
}

export default class extends HTMLElement {
	state: {
		open: boolean
	}

	static get observedAttributes() {
		return [ATTR.DATA_OPEN]
	}

	constructor() {
		super()
		const open = asBoolean(this.getAttribute(ATTR.DATA_OPEN))
		this.state = {open}
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		this.state.open = asBoolean(next)
		this.render()
	}

	html(open) {
		return html`
		<style>
			.backdrop {
				opacity: 0;
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 1000;
				background: black;
				animation-name: showBackdrop;
				animation-duration: 0.3s;
				animation-fill-mode: forwards;
			}
			.modal {
				margin: auto;
				padding: 1rem;
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 1001;
				animation-name: showModal;
				animation-duration: 0.3s;
				animation-fill-mode: forwards;
			}
			.dialog {
				margin: auto;
				border-radius: 5px;
				background: white;
				box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
				overflow: hidden;
			}
			.header {
				position: relative;
				.close-button {
					position: absolute;
					width: 40px;
					top: 0;
					bottom: 0;
					right: 0;
					border: none;
					outline: none;
					cursor: pointer;
					background-color: transparent;
					appearance: none;
					font-size: 1.4rem;
				}
			}
			.close {
				.backdrop,
				.modal {
					display: none;
				}
			}
			.open {
				.modal {
					overflow-x: hidden;
					overflow-y: auto;
				}
			}
			@media (min-width: 768px) {
				.modal {
					margin: 3rem auto;
					padding: 0;
				}
				.dialog {
					max-width: 740px;
				}
			}
			@media (min-width: 1024px) {
				.dialog {
					max-width: 920px;
				}
			}
			@keyframes showBackdrop {
				from {
					opacity: 0;
				}
				to {
					opacity: 0.5;
				}
			}
			@keyframes showModal {
				from {
					opacity: 0;
					transform: translateY(20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		</style>
		<div class$=${open ? 'open' : 'close'}>
			<div class=backdrop></div>
			<div class=modal>
				<div class=dialog>
					<div class=content>
						<div class=header>
							<slot name=header></slot>
							<button class=close-button on-click=${() => this.onClickClose()}>×</button>
						</div>
						<div class=body>
							<slot name=body></slot>
						</div>
					</div>
				</div>
			</div>
		</div>
		`
	}

	render() {
		render(this.html(this.state.open), this)
	}

	onClickClose() {
		this.setAttribute(ATTR.DATA_OPEN, 'disabled')
	}
}
