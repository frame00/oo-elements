import {OOUserUID} from './oo-user'
import {OOMessageType} from './oo-message'

export interface MessageOptionsPost {
	users?: Array<OOUserUID>,
	body: string,
	author?: OOUserUID,
	project?: string,
	type?: OOMessageType
}
