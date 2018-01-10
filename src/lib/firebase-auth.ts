import firebaseImport from './firebase'
import {GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from '@firebase/auth-types'
import {AuthProvider} from '../d/auth-provider'
import {AuthResult} from '../d/auth-result'
import {Firebase} from '../d/firebase'

const state = {
	initialized: false
}
const initialize = (f: Firebase): Firebase => {
	if (state.initialized === false) {
		const config = {
			apiKey: 'AIzaSyD_7hyu6yjfwy18RzJ1Msg6FS0QLBSzbq4',
			authDomain: 'ooapp-6c046.firebaseapp.com',
			databaseURL: 'https://ooapp-6c046.firebaseio.com',
			projectId: 'ooapp-6c046',
			storageBucket: 'ooapp-6c046.appspot.com',
			messagingSenderId: '90122914908'
		}
		f.initializeApp(config)
		state.initialized = true
	}
	return f
}

export default async (authProvider: AuthProvider): Promise<AuthResult> => {
	const f = await firebaseImport()
	const firebase = initialize(f)
	const provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider = (prov => {
		switch(prov) {
			case 'google':
				return new firebase.auth.GoogleAuthProvider()
			case 'facebook':
				return new firebase.auth.FacebookAuthProvider()
			case 'github':
				return new firebase.auth.GithubAuthProvider()
			default:
				return new firebase.auth.GoogleAuthProvider()
		}
	})(authProvider)

	const result: AuthResult = await firebase.auth().signInWithPopup(provider)
	return result
}
