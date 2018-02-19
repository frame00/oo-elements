import {html, render} from '../../lib/html'
import customEvent from '../../lib/custom-event'

const ATTR = {
	DATA_OPEN: 'data-open'
}
const EVENT = {
	CLOSE: customEvent('close')
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

const open: WeakMap<object, boolean> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_OPEN]
	}

	constructor() {
		super()
		open.set(this, asBoolean(this.getAttribute(ATTR.DATA_OPEN)))
		this.render()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		if (open.get(this) && asBoolean(next) === false) {
			this.dispatchClose()
		}
		open.set(this, asBoolean(next))
		this.render()
	}

	html(state: boolean) {
		return html`
		<style>
			@import '../../style/_reset-button.css';
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
		<div class$='${state ? 'open' : 'close'}'>
			<div class=backdrop></div>
			<div class=modal>
				<div class=dialog>
					<div class=content>
						<div class=header>
							<slot name=header></slot>
							<button class=close-button on-click='${() => this.onClickClose()}'>×</button>
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
		render(this.html(open.get(this)), this)
	}

	onClickClose() {
		this.setAttribute(ATTR.DATA_OPEN, 'disabled')
	}

	dispatchClose() {
		this.dispatchEvent(EVENT.CLOSE)
	}
}
