import {OOExtensions} from './oo-extension'

export interface OOPayment {
	uid: string,
	created: number,
	Extensions?: OOExtensions
}
