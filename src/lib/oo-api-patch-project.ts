import api from '../lib/oo-api'
import {OOAPIResult} from '../type/oo-api'
import {OOExtension} from '../type/oo-extension'
import {OOProject} from '../type/oo-project'

interface ProjectOptionsPost {
	uid: string,
	approve?: boolean,
	title?: string,
	body?: string,
	tags?: Array<string>
}

export default async (options: ProjectOptionsPost): Promise<OOAPIResult<OOProject>> => {
	const {uid, approve, title, body, tags} = options
	const extensions: Array<OOExtension> = []
	if (approve !== undefined) {
		extensions.push({
			key: 'approve',
			value: approve
		})
	}
	if (title) {
		extensions.push({
			key: 'title',
			value: title
		})
	}
	if (body) {
		extensions.push({
			key: 'body',
			value: body
		})
	}
	if (tags) {
		extensions.push({
			key: 'tags',
			value: tags
		})
	}

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
