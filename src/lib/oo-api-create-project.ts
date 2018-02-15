import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOUserUID} from '../type/oo-user'
import {OOProject} from '../type/oo-project'
import {Scope} from '../type/scope'
import createExtensions from '../lib/create-extensions'
import {Currency} from '../type/currency'

interface ProjectOptionsPost {
	body: string,
	author: OOUserUID,
	scope: Scope,
	users?: Array<OOUserUID>,
	assignee?: OOUserUID,
	currency?: Currency
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const extensions = createExtensions(options)

	const ooapiRes = await api<OOProject>({
		resource: 'projects',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
