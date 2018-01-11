import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'

export default async (uid: string): Promise<OOAPIResult> => {
	const ooapiRes = await api({
		resource: 'users',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
