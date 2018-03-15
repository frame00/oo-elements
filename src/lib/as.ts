import {Scope} from '../type/scope'
import {SignInFlow} from '../type/sign-in-flow'

export const asScope = (d: string): Scope => {
	if (d === 'public' || d === 'private') {
		return d
	}
	return 'public'
}

export const asSignInFlow = (d: string): SignInFlow => {
	if (d === 'popup' || d === 'redirect') {
		return d
	}
	return 'popup'
}
