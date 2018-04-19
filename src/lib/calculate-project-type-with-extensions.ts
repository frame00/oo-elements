import {OOExtensions} from '../type/oo-extension'
import {ProjectType} from '../type/oo-project'

const find = (exts: OOExtensions, cond: string) => exts.some(ext => ext.key === cond)

const hasAssignee = (exts: OOExtensions) => find(exts, 'assignee')
const hasSkill = (exts: OOExtensions) => find(exts, 'skill')

export default (exts: OOExtensions): ProjectType => {
	if (hasAssignee(exts)) {
		return 'ask'
	}
	if (hasSkill(exts)) {
		return 'skill'
	}
	return 'post'
}
