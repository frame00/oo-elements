import auth from './firebase-auth'
import {AuthProvider} from '../d/auth-provider'
import {OOAPIResponse, OOAPIResponseError} from '../d/oo-api-response'
import api from '../lib/oo-api'

export default async (provider: AuthProvider): Promise<OOAPIResponse | OOAPIResponseError> => {
	const authRes = await auth(provider)
	const uid = authRes.user.uid
	const ooapiRes = await api({
		resource: 'users',
		method: 'POST',
		body: {
			firebase_uid: uid
		}
	})

	if (RegExp.prototype.test.call(/^2[0-9]+/, ooapiRes.status)) {
		return ooapiRes.response[0]
	}
	return ooapiRes.response
}
