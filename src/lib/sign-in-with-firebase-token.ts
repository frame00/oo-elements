import {OOToken} from '../type/oo-token'
import {OOUserUID, OOUser} from '../type/oo-user'
import api from '../lib/oo-api'
import createToken from './oo-api-create-token'
import isSuccess from './is-api-success'
import state from './state'
import store from './local-storage'
import createExtensions from './create-extensions'
import {AuthResult} from '../type/auth-result'

const setState = (token: string, uid: string): void => {
	state.set('token', token)
	store.token = token
	store.uid = uid
}

export default async (authRes: AuthResult): Promise<{
	token: OOToken,
	uid: OOUserUID
} | boolean> => {
	const firebaseUid = authRes.user.uid
	const {name, email, picture} = authRes.additionalUserInfo.profile
	const extensions = createExtensions({name, email, picture})
	const ooapiRes = await api<OOUser>({
		resource: 'users',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid,
			Extensions: extensions
		}
	})

	if (!(!Array.isArray(ooapiRes.response) && ooapiRes.response.message.includes('existing'))) {
		return false
	}

	const tokenRes = await createToken(firebaseUid)

	if (!isSuccess(tokenRes.status)) {
		return false
	}

	if (!Array.isArray(tokenRes.response)) {
		return false
	}

	const [token] = tokenRes.response

	if (typeof token !== 'string') {
		return false
	}

	const uid = (res => {
		if (Array.isArray(res)) {
			const [u] = res
			return u.uid
		}
		const {user} = ooapiRes.response
		return user.uid
	})(ooapiRes.response)

	setState(token, uid)

	return {
		token,
		uid
	}
}
