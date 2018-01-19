import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOProject} from '../d/oo-project'
import {OOMessage} from '../d/oo-message'

export default async (uid: string): Promise<OOAPIResult<OOMessage>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'messages',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
