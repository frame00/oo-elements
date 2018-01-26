import api from '../lib/oo-api'
import {OOAPIResult} from '../d/oo-api'
import {OOExtension} from '../d/oo-extension'
import {OOMessage} from '../d/oo-message'
import {MessageOptionsPost} from '../d/oo-options-message'

const kv = <T>(obj: MessageOptionsPost, key: string): {key: string, value: T} | false => {
	if (obj === undefined || obj[key] === undefined) {
		return false
	}
	return {
		key,
		value: obj[key]
	}
}

export default async (options: MessageOptionsPost, test?: boolean): Promise<OOAPIResult<OOMessage>> => {
	if (typeof test === 'boolean') {
		if (test === false) {
			return {
				response: {message: 'error'},
				headers: new Headers(),
				status: 500
			}
		}
	}
	const extensions: Array<OOExtension> = (opts => {
		const exts: Array<OOExtension> = []
		const users = kv<Array<string>>(opts, 'users')
		if (users) {
			exts.push(users)
		}
		const body = kv<string>(opts, 'body')
		if (body) {
			exts.push(body)
		}
		const author = kv<string>(opts, 'author')
		if (author) {
			exts.push(author)
		}
		const project = kv<string>(opts, 'project')
		if (project) {
			exts.push(project)
		}
		return exts
	})(options)

	const ooapiRes = await api<OOMessage>({
		resource: 'messages',
		method: 'POST',
		body: {
			Extensions: extensions
		}
	})

	return ooapiRes
}
