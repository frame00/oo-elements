import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOExtension} from '../type/oo-extension'
import {OOProject} from '../type/oo-project'

interface ProjectOptionsPost {
	uid: string,
	approve: boolean
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const {uid, approve} = options
	const extensions: Array<OOExtension> = [
		{
			key: 'approve',
			value: approve
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
