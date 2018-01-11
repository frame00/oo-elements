import {OOUser} from './oo-user'
import {OOExtension} from './oo-extension'
import {OOToken} from './oo-token'

export interface OOAPIResponseError {
	message: string,
	[key: string]: any
}

export type OOAPIResponse = Array<OOUser | OOExtension | OOToken> | OOAPIResponseError
