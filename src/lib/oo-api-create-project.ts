import api from '../lib/oo-api'
import { OOAPIResult } from '../type/oo-api'
import { OOUserUID } from '../type/oo-user'
import { OOProject } from '../type/oo-project'
import { Scope } from '../type/scope'
import createExtensions from '../lib/create-extensions'
import { Currency } from '../type/currency'
import calculateProjectType from './calculate-project-type'

interface ProjectOptionsPost {
	body: string
	author: OOUserUID
	scope: Scope
	title?: string
	users?: OOUserUID[]
	assignee?: OOUserUID
	currency?: Currency
}

export default async (
	options: ProjectOptionsPost
): Promise<OOAPIResult<OOProject>> => {
	const extensions = createExtensions(options)
	const type = calculateProjectType(extensions)
	const typeContainedExtensions = [...extensions, ...createExtensions({ type })]

	return api<OOProject>({
		resource: 'projects',
		method: 'POST',
		body: {
			Extensions: typeContainedExtensions
		}
	})
}
