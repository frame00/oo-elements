import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOUser} from '../d/oo-user'

export default async (uid: string): Promise<OOAPIResult<OOUser>> => {
	const ooapiRes = await api<OOUser>({
		resource: 'users',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
