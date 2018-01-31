import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOToken} from '../type/oo-token'

export default async (firebaseUid: string): Promise<OOAPIResult<OOToken>> => {
	const ooapiRes = await api<OOToken>({
		resource: 'users',
		pathParameter: 'sign',
		method: 'POST',
		body: {
			firebase_uid: firebaseUid
		}
	})

	return ooapiRes
}
