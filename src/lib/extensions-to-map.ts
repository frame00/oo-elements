import { OOExtension } from '../type/oo-extension'
import { OOUser } from '../type/oo-user'
import { OOProject } from '../type/oo-project'
import { OOMessage } from '../type/oo-message'

export default (item: OOUser | OOProject | OOMessage): Map<string, any> => {
	const { Extensions } = item
	if (Array.isArray(Extensions)) {
		const extensions = Extensions
		const data = []
		for (const ext of extensions) {
			data.push([ext.key, ext.value])
		}
		return new Map(data)
	}
	return new Map()
}
