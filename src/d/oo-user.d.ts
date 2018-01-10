import {OOExtensions} from './oo-extension'

export type OOUserUID = string

export interface OOUser {
	uid: OOUserUID,
	created: number,
	Extensions: OOExtensions
}
