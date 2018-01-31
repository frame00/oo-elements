import {html} from 'lit-html'
import render from '../../lib/render'
import {AuthProvider} from '../../type/auth-provider.d'
import signInWithFirebase from '../../lib/sign-in-with-firebase'
import store from '../../lib/local-storage'

const ATTR = {
	DATA_PROVIDER: 'data-provider'
}
const EVENT = {
	SIGNED_IN: detail => new CustomEvent('signedin', {detail}),
	SIGNED_IN_ERROR: detail => new CustomEvent('signedinerror', {detail})
}

const asValidString = (data: string): AuthProvider => {
	if (data === 'google' || data === 'facebook' || data === 'github') {
		return data
	}
	return 'google'
}

const provider: WeakMap<object, AuthProvider> = new WeakMap()

export default class extends HTMLElement {
	static get observedAttributes() {
		return [ATTR.DATA_PROVIDER]
	}

	get provider() {
		return provider.get(this)
	}

	constructor() {
		super()
		provider.set(this, asValidString(this.getAttribute(ATTR.DATA_PROVIDER)))
		this.render()
	}

	connectedCallback() {
		this.checkSignInStatus()
	}

	attributeChangedCallback(attr, prev, next) {
		if (prev === next) {
			return
		}
		provider.set(this, asValidString(next))
		this.render()
	}

	html(prov: AuthProvider) {
		let label: string = prov
		switch (prov) {
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
				break
		}
		return html`
		<style>
			@import '../../style/_reset-button.css';
			@import '../../style/_vars-font-family.css';
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
				border-radius: 5px;
				color: white;
				font-family: var(--font-family);
				transition: background 0.2s, transform 0.2s;
				&:active {
					position: relative;
					transform: translateY(2px);
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
		</style>
		<button class$='${prov}' on-click='${() => this.signIn()}'>
			Sign in with ${label}
		</button>
		`
	}

	render() {
		render(this.html(provider.get(this)), this)
	}

	async signIn(test?: string) {
		try {
			const signedIn = await signInWithFirebase(provider.get(this), test)
			if (typeof signedIn === 'boolean') {
				throw new Error()
			}
			this.dispatchEvent(EVENT.SIGNED_IN(signedIn))
		} catch(err) {
			this.dispatchEvent(EVENT.SIGNED_IN_ERROR(err))
		}
	}

	checkSignInStatus() {
		if (typeof store.uid === 'string' && typeof store.token === 'string') {
			this.dispatchEvent(EVENT.SIGNED_IN({
				token: store.token,
				uid: store.uid
			}))
		}
	}
}
