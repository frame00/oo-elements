import {AuthResult} from '../../type/auth-result'
import signInWithFirebaseToken from '../../lib/sign-in-with-firebase-token'
import {dispatch} from '../../lib/notification'
import weakMap from '../../lib/weak-map'
import SignIn from '../../lib/classes/sign-in'
const {document} = window

const stateIframe = weakMap<HTMLIFrameElement>()

export default class extends SignIn {
	connectedCallback() {
		super.connectedCallback()
		const div = document.createElement('div')
		const shadow = div.attachShadow({mode: 'open'})
		this.appendChild(div)
		shadow.innerHTML = `<iframe src='./dist/assets/iframe.firebase.authenticate.html?${this.provider}'></iframe>`
		const iframe = shadow.querySelector('iframe')
		stateIframe.set(this, iframe)
	}

	async signIn() {
		super.signIn()
		const iframe = stateIframe.get(this)
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
			dispatch({
				message: 'Welcome!',
				type: 'success'
			})
		}
	}
}
