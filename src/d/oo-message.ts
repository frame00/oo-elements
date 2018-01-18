import {OOExtensions} from './oo-extension'

export interface OOMessage {
	uid: string,
	created: number,
	Extensions?: OOExtensions
}
