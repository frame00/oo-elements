import {FirebaseAuth, EmailAuthProvider, EmailAuthProvider_Instance, FacebookAuthProvider, FacebookAuthProvider_Instance, GithubAuthProvider, GithubAuthProvider_Instance, GoogleAuthProvider, GoogleAuthProvider_Instance, OAuthProvider, PhoneAuthProvider, PhoneAuthProvider_Instance, RecaptchaVerifier, RecaptchaVerifier_Instance, TwitterAuthProvider, TwitterAuthProvider_Instance} from '@firebase/auth-types'
import {FirebaseApp, FirebaseOptions} from '@firebase/app-types';

export interface Firebase {
	auth: {
		(app?: FirebaseApp): FirebaseAuth
		Auth: typeof FirebaseAuth
		EmailAuthProvider: typeof EmailAuthProvider
		EmailAuthProvider_Instance: typeof EmailAuthProvider_Instance
		FacebookAuthProvider: typeof FacebookAuthProvider
		FacebookAuthProvider_Instance: typeof FacebookAuthProvider_Instance
		GithubAuthProvider: typeof GithubAuthProvider
		GithubAuthProvider_Instance: typeof GithubAuthProvider_Instance
		GoogleAuthProvider: typeof GoogleAuthProvider
		GoogleAuthProvider_Instance: typeof GoogleAuthProvider_Instance
		OAuthProvider: typeof OAuthProvider
		PhoneAuthProvider: typeof PhoneAuthProvider
		PhoneAuthProvider_Instance: typeof PhoneAuthProvider_Instance
		RecaptchaVerifier: typeof RecaptchaVerifier
		RecaptchaVerifier_Instance: typeof RecaptchaVerifier_Instance
		TwitterAuthProvider: typeof TwitterAuthProvider
		TwitterAuthProvider_Instance: typeof TwitterAuthProvider_Instance
	},
	initializeApp(options: FirebaseOptions, name?: string): FirebaseApp
}
