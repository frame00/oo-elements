import { OOElement } from '../../elements/oo-element'
import { html } from '../html'
import { AuthProvider } from '../../type/auth-provider'
import store from '../local-storage'
import {
	SignedInDetail,
	SignedIn,
	SignedInError,
	SignedInErrorDetail
} from '../../type/event'
import { attach, dispatch } from '../notification'
import weakMap from '../weak-map'
import customEvent from '../../lib/custom-event'

const ATTR = {
	DATA_PROVIDER: 'data-provider',
	DATA_INIT_NOTIFICATION: 'data-init-notification'
}
const EVENT = {
	SIGNED_IN: (detail: SignedInDetail): SignedIn =>
		customEvent('signedin', detail),
	SIGNED_IN_ERROR: (detail: SignedInErrorDetail): SignedInError =>
		customEvent('signedinerror', detail)
}

const asValidString = (data: string): AuthProvider => {
	if (data === 'google' || data === 'facebook' || data === 'github') {
		return data
	}
	return 'google'
}

const provider = weakMap<AuthProvider>()

export default class extends OOElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROVIDER]
	}

	get provider() {
		return provider.get(this)
	}

	constructor() {
		super()
		provider.set(this, asValidString(this.getAttribute(ATTR.DATA_PROVIDER)))
		attach()
	}

	connectedCallback() {
		super.connectedCallback()
		this.checkSignInStatus()
	}

	attributeChangedCallback([, prev, next]) {
		if (prev === next) {
			return
		}
		provider.set(this, asValidString(next))
		if (this.connected) {
			this.update()
		}
	}

	render() {
		let label = ''
		switch (provider.get(this)) {
			case 'google':
				label = 'Google'
				break
			case 'facebook':
				label = 'Facebook'
				break
			case 'github':
				label = 'GitHub'
				break
			default:
		}
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-font-family.css';
			@import '../../style/_vars-input.css';
			:host {
				display: inline-block;
			}
			:root {
				--google: #4283f4;
				--facebook: #4267b2;
				--github: #444;
			}
			button {
				width: inherit;
				height: inherit;
				padding: 0.8rem 1rem;
				border-radius: 99px;
				color: white;
				font-family: var(--font-family);
				transition: background 0.2s, transform 0.2s;
				&:active {
					position: relative;
					transform: translateY(2px);
				}
				&:focus {
					border: var(--focused-border);
					border-color: black;
				}
			}
			.google {
				background: var(--google);
				&:hover {
					background: color(var(--google) blackness(+10%));
				}
			}
			.facebook {
				background: var(--facebook);
				&:hover {
					background: color(var(--facebook) blackness(+10%));
				}
			}
			.github {
				background: var(--github);
				&:hover {
					background: color(var(--github) blackness(+15%));
				}
			}
			iframe {
				display: none;
			}
		</style>
		<button class$='${label.toLocaleLowerCase()}' on-click='${async () =>
			this.signIn()
				.then()
				.catch()}'>
			Sign in with ${label}
		</button>
		`
	}

	protected async signIn() {
		// Sign in
	}

	checkSignInStatus() {
		if (typeof store.uid !== 'string' || typeof store.token !== 'string') {
			return
		}
		this.dispatchSignedIn({
			token: store.token,
			uid: store.uid
		})
	}

	dispatchSignedIn(data: SignedInDetail) {
		this.dispatchEvent(EVENT.SIGNED_IN(data))
	}

	dispatchSignedInError(data: SignedInErrorDetail) {
		dispatch({
			message: `Sign-in failure/${data.message}`,
			type: 'error'
		})
		this.dispatchEvent(EVENT.SIGNED_IN_ERROR(data))
	}
}
