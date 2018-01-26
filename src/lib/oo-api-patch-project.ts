import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOExtension} from '../d/oo-extension'
import {OOProject} from '../d/oo-project'

interface ProjectOptionsPost {
	offer_permission: boolean
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const extensions: Array<OOExtension> = [
		{
			key: 'offer_permission',
			value: options.offer_permission
		}
	]

	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		method: 'PATCH',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
