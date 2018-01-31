import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOExtension} from '../type/oo-extension'
import {OOProject} from '../type/oo-project'

interface ProjectOptionsPost {
	uid: string,
	offer_permission: boolean
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const {uid, offer_permission} = options
	const extensions: Array<OOExtension> = [
		{
			key: 'offer_permission',
			value: offer_permission
		}
	]

	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		pathParameter: uid,
		method: 'PATCH',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
