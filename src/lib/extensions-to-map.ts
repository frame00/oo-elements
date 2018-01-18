import {OOExtension} from '../d/oo-extension'
import {OOUser} from '../d/oo-user'
import {OOProject} from '../d/oo-project'
import {OOMessage} from '../d/oo-message'

export default (item: OOUser | OOProject | OOMessage): Map<string, any> => {
	const {Extensions} = item
	if (Array.isArray(Extensions)) {
		const extensions: Array<OOExtension> = Extensions
		const data = []
		for(const ext of extensions) {
			data.push([ext.key, ext.value])
		}
		return new Map(data)
	}
	return new Map()
}
