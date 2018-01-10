import {OOUser} from './oo-user'
import {OOExtension} from './oo-extension'

export interface OOAPIResponseError {
	message: string,
	[key: string]: any
}

export type OOAPIResponse = Array<OOUser | OOExtension> | OOAPIResponseError
