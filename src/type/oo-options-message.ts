import {OOUserUID} from './oo-user'
import {AllowedParametersInBody} from './oo-message'

export interface MessageOptionsPost extends AllowedParametersInBody {
	users?: Array<OOUserUID>,
	body: string,
	author?: OOUserUID,
	project?: string,
}
