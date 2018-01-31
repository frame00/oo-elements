import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOProject} from '../type/oo-project'
import {OOMessage} from '../type/oo-message'

export default async (uid: string): Promise<OOAPIResult<OOMessage>> => {
	const ooapiRes = await api<OOProject>({
		resource: 'messages',
		pathParameter: uid,
		method: 'GET'
	})

	return ooapiRes
}
