import {OOToken} from '../type/oo-token'
import {OOUserUID, OOUser} from '../type/oo-user'
import api from '../lib/oo-api'
import createToken from './oo-api-create-token'
import isSuccess from './is-api-success'
import state from './state'
import store from './local-storage'
import createExtensions from './create-extensions'
import {AuthResult} from '../type/auth-result'
import {OOAPIResponseError} from '../type/oo-api-response'

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
	const {name} = authRes.additionalUserInfo.profile
	const {email, photoURL: picture} = authRes.user
	const extensions = createExtensions({name, email, picture})
	const ooapiRes = await api<OOUser>({
		resource: 'users',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid,
			Extensions: extensions
		}
	})

	const {response, status} = ooapiRes
	const isApiSuccess = Array.isArray(response)
	const isApiExisting = status === 400
	if (!isApiSuccess && !isApiExisting) {
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
		if (isApiSuccess) {
			const [u] = res as Array<OOUser>
			return u.uid
		}
		if (isApiExisting) {
			const {user} = res as OOAPIResponseError
			return user.uid
		}
	})(response)

	setState(token, uid)

	return {
		token,
		uid
	}
}
