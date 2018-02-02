import {html} from 'lit-html'
import render from '../../lib/render'
import {AuthProvider} from '../../type/auth-provider.d'
import store from '../../lib/local-storage'
import {AuthResult} from '../../type/auth-result'
import signInWithFirebaseToken from '../../lib/sign-in-with-firebase-token'
import {SignedInDetail, SignedIn, SignedInError, SignedInErrorDetail} from '../../type/event'
import {attach, dispatch} from '../../lib/notification'
import weakMap from '../../lib/weak-map'

const ATTR = {
	DATA_PROVIDER: 'data-provider',
	DATA_INIT_NOTIFICATION: 'data-init-notification'
}
const EVENT = {
	SIGNED_IN: (detail: SignedInDetail): SignedIn => new CustomEvent('signedin', {detail}),
	SIGNED_IN_ERROR: (detail: SignedInErrorDetail): SignedInError => new CustomEvent('signedinerror', {detail})
}

const asValidString = (data: string): AuthProvider => {
	if (data === 'google' || data === 'facebook' || data === 'github') {
		return data
	}
	return 'google'
}
const asBoolean = (data: string): boolean => {
	if(data === 'enabled') {
		return true
	}
	return false
}

const provider = weakMap<AuthProvider>()
const initNotification = weakMap<boolean>()
let signedInNotification = false

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
		initNotification.set(this, asBoolean(this.getAttribute(ATTR.DATA_INIT_NOTIFICATION)))
		this.render()
		attach()
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
			iframe {
				display: none;
			}
		</style>
		<button class$='${prov}' on-click='${() => this.signIn()}'>
			Sign in with ${label}
		</button>
		<iframe src$="./dist/assets/iframe.firebase.authenticate.html?${prov}"></iframe>
		`
	}

	render() {
		render(this.html(provider.get(this)), this)
	}

	async signIn() {
		const iframe = this.shadowRoot.querySelector('iframe')
		const token = await new Promise<AuthResult>((resolve, reject) => {
			iframe.contentWindow.postMessage('run', '*')
			const listener = e => {
				const {source, data} = e
				if (source !== iframe.contentWindow) {
					return
				}
				let json: any
				try {
					json = JSON.parse(data)
				} catch(err) {
					return
				}
				try {
					if (json.code) {
						return reject(json)
					}
					const result = json as AuthResult
					resolve(result)
					window.removeEventListener('message', listener)
				} catch(err) {
					reject(err)
				}
			}
			window.addEventListener('message', listener)
		}).catch(err => {
			this.dispatchSignedInError(err)
		})
		if (token) {
			dispatch({
				message: 'Signing in ...'
			})

			const signedIn = await signInWithFirebaseToken(token)
			if (typeof signedIn === 'boolean') {
				return this.dispatchSignedInError(signedIn)
			}
			this.dispatchSignedIn(signedIn)
		}
	}

	checkSignInStatus() {
		if (initNotification.get(this) === false) {
			return
		}
		if (typeof store.uid === 'string' && typeof store.token === 'string') {
			this.dispatchSignedIn({
				token: store.token,
				uid: store.uid
			})
		}
	}

	dispatchSignedIn(data: SignedInDetail) {
		if (signedInNotification === false) {
			dispatch({
				message: 'Welcome!',
				type: 'success'
			})
			signedInNotification = true
		}
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
